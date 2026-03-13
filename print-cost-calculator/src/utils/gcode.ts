export interface GCodeInfo {
  weight: number | null;      // граммы
  duration: number | null;    // часы
  filename: string;
}

/**
 * Парсит G-code файл и извлекает вес филамента и время печати.
 * Поддерживает комментарии от PrusaSlicer, Cura, OrcaSlicer, BambuStudio.
 */
export function parseGCode(content: string, filename: string): GCodeInfo {
  let weight: number | null = null;
  let duration: number | null = null;

  // Берём только первые и последние 200 строк (метаданные обычно там)
  const lines = content.split('\n');
  const head = lines.slice(0, 300);
  const tail = lines.slice(-300);
  const search = [...head, ...tail];

  for (const line of search) {
    const trimmed = line.trim();

    // ── Вес филамента ──────────────────────
    // PrusaSlicer: ; filament used [g] = 12.34
    if (!weight) {
      const pruWeight = trimmed.match(/;\s*filament used \[g\]\s*=\s*([\d.]+)/i);
      if (pruWeight) weight = parseFloat(pruWeight[1]);
    }
    // Cura: ;Filament used: 1.234m  → примерно вес = длина * 2.98 (PLA 1.75mm)
    if (!weight) {
      const curaLength = trimmed.match(/;\s*Filament used:\s*([\d.]+)m/i);
      if (curaLength) weight = parseFloat(curaLength[1]) * 2.98;
    }
    // OrcaSlicer / BambuStudio: ; total filament used [g] = 12.34
    if (!weight) {
      const orcaWeight = trimmed.match(/;\s*total filament used \[g\]\s*=\s*([\d.]+)/i);
      if (orcaWeight) weight = parseFloat(orcaWeight[1]);
    }
    // Generic: ; filament_weight = 12.34
    if (!weight) {
      const genWeight = trimmed.match(/;\s*filament_weight\s*=\s*([\d.]+)/i);
      if (genWeight) weight = parseFloat(genWeight[1]);
    }

    // ── Время печати ───────────────────────
    // PrusaSlicer: ; estimated printing time (normal mode) = 1h 23m 45s
    if (!duration) {
      const pruTime = trimmed.match(/;\s*estimated printing time.*?=\s*(.+)/i);
      if (pruTime) duration = parseTimeString(pruTime[1]);
    }
    // Cura: ;TIME:12345 (секунды)
    if (!duration) {
      const curaTime = trimmed.match(/;\s*TIME:\s*(\d+)/i);
      if (curaTime) duration = parseInt(curaTime[1]) / 3600;
    }
    // OrcaSlicer: ; estimated printing time = 1h 23m 45s
    if (!duration) {
      const orcaTime = trimmed.match(/;\s*estimated printing time\s*=\s*(.+)/i);
      if (orcaTime) duration = parseTimeString(orcaTime[1]);
    }
    // BambuStudio: ; total estimated time: 1h23m45s
    if (!duration) {
      const bambuTime = trimmed.match(/;\s*total estimated time:\s*(.+)/i);
      if (bambuTime) duration = parseTimeString(bambuTime[1]);
    }

    if (weight && duration) break;
  }

  return {
    weight: weight ? Math.round(weight * 10) / 10 : null,
    duration: duration ? Math.round(duration * 100) / 100 : null,
    filename,
  };
}

function parseTimeString(s: string): number | null {
  let hours = 0;
  const h = s.match(/(\d+)\s*h/i);
  const m = s.match(/(\d+)\s*m(?:in)?/i);
  const sec = s.match(/(\d+)\s*s/i);
  if (h) hours += parseInt(h[1]);
  if (m) hours += parseInt(m[1]) / 60;
  if (sec) hours += parseInt(sec[1]) / 3600;
  return hours > 0 ? hours : null;
}

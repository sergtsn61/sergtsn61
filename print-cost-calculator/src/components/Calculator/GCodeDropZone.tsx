import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { parseGCode, GCodeInfo } from '../../utils/gcode';
import { useI18n } from '../../i18n';

interface Props {
  onParsed: (info: GCodeInfo) => void;
}

export function GCodeDropZone({ onParsed }: Props) {
  const { t } = useI18n();
  const [isDragOver, setIsDragOver] = useState(false);
  const [parsed, setParsed] = useState<GCodeInfo | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.name.match(/\.(gcode|gco|g)$/i)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const info = parseGCode(content, file.name);
      setParsed(info);
      onParsed(info);
    };
    reader.readAsText(file);
  }, [onParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  if (parsed) {
    return (
      <div className="card px-3 py-2.5 flex items-center gap-2.5 animate-fade-in">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-success/10">
          <FileText size={13} className="text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-text-primary truncate">{parsed.filename}</p>
          <p className="text-xs text-text-muted">
            {t.gcode.parsed}:
            {parsed.weight != null && ` ${t.gcode.weight} ${parsed.weight}${t.units.g}`}
            {parsed.duration != null && ` · ${t.gcode.time} ${parsed.duration.toFixed(1)}${t.units.hours}`}
            {parsed.weight == null && parsed.duration == null && ' —'}
          </p>
        </div>
        <button
          onClick={() => setParsed(null)}
          className="text-text-muted hover:text-text-primary p-1 transition-colors"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      className={`
        card border-dashed border-2 px-3 py-3 flex items-center justify-center gap-2
        transition-all duration-200 cursor-pointer
        ${isDragOver
          ? 'border-accent-primary bg-accent-muted'
          : 'border-border-default hover:border-border-focus hover:bg-bg-hover'
        }
      `}
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.gcode,.gco,.g';
        input.onchange = () => { if (input.files?.[0]) handleFile(input.files[0]); };
        input.click();
      }}
    >
      <Upload size={14} className={isDragOver ? 'text-accent-primary' : 'text-text-muted'} />
      <span className={`text-xs ${isDragOver ? 'text-accent-primary font-medium' : 'text-text-muted'}`}>
        {isDragOver ? t.gcode.dropActive : t.gcode.dropHint}
      </span>
    </div>
  );
}

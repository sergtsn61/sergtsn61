interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  displayFormat?: (v: number) => string;
}

export function SliderInput({
  label, value, onChange, min = 0, max = 100, step = 1, unit = '%', displayFormat
}: SliderInputProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = displayFormat ? displayFormat(value) : `${value}${unit}`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary font-medium">{label}</span>
        <span className="text-sm font-semibold text-accent-primary">{display}</span>
      </div>
      <div className="relative">
        <div
          className="absolute h-1 rounded-full bg-accent-primary/30 top-1/2 -translate-y-1/2 left-0"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full relative z-10"
        />
      </div>
      <div className="flex justify-between text-xs text-text-muted">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

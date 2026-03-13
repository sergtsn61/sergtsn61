import React from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}

export function NumberInput({ label, value, onChange, unit, min = 0, max, step = 1, hint }: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) onChange(v);
  };

  return (
    <div className="space-y-1.5">
      <label className="flex items-center justify-between">
        <span className="text-xs text-text-secondary font-medium">{label}</span>
        {hint && <span className="text-xs text-text-muted">{hint}</span>}
      </label>
      <div className="relative flex items-center">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className="input-field pr-12"
        />
        {unit && (
          <span className="absolute right-3 text-xs text-text-muted font-medium pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}


import React from 'react';
import type { UpscaleFactor, UpscaleOption } from '../types';

interface UpscaleOptionsProps {
  options: UpscaleOption[];
  selected: UpscaleFactor;
  onChange: (factor: UpscaleFactor) => void;
  disabled: boolean;
}

const UpscaleOptions: React.FC<UpscaleOptionsProps> = ({ options, selected, onChange, disabled }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          disabled={disabled}
          className={`p-4 rounded-lg text-left transition-all duration-300 border-2
            ${selected === option.id
              ? 'bg-brand-primary/20 border-brand-primary shadow-lg'
              : 'bg-base-300 border-transparent hover:border-brand-secondary'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <p className="font-bold text-lg text-text-primary">{option.name}</p>
          <p className="text-sm text-text-secondary">{option.description}</p>
        </button>
      ))}
    </div>
  );
};

export default UpscaleOptions;

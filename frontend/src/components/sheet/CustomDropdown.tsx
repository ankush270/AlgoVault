import React from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string | React.ReactNode;
  color?: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  buttonIcon?: React.ReactNode;
  placeholder?: string;
  dropdownWidth?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  isOpen,
  onToggle,
  buttonIcon,
  placeholder = 'Select option',
  dropdownWidth = 'w-56',
}) => {
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 bg-slate-950 border ${
          selectedValue !== 'all' ? 'border-cyan-500/60 text-cyan-300' : 'border-slate-800 text-slate-300'
        } hover:border-cyan-500/50 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-sm transition-all`}
      >
        {buttonIcon}
        <span>
          {selectedOption
            ? `${selectedOption.icon ? selectedOption.icon + ' ' : ''}${selectedOption.label}`
            : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 ${dropdownWidth} max-h-72 overflow-y-auto bg-slate-950/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 p-1.5 space-y-1 text-xs animate-fadeIn`}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold transition-all ${
                selectedValue === opt.value
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : `${opt.color || 'text-slate-300'} hover:bg-slate-800/80 hover:text-white`
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                {opt.icon && <span>{opt.icon}</span>}
                <span className="truncate">{opt.label}</span>
              </span>
              {selectedValue === opt.value && <Check size={14} className="text-cyan-400 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
  dropdownWidth = 'w-full min-w-[220px] sm:min-w-[260px]',
}) => {
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div className="relative w-full">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-2 bg-white border ${
          selectedValue !== 'all' ? 'border-blue-400 text-blue-700 bg-blue-50/50' : 'border-slate-200 text-slate-700'
        } hover:border-slate-300 hover:bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold shadow-sm transition-all`}
      >
        <span className="flex items-center gap-2 truncate min-w-0">
          {buttonIcon}
          <span className="truncate">
            {selectedOption
              ? `${selectedOption.icon ? selectedOption.icon + ' ' : ''}${selectedOption.label}`
              : placeholder}
          </span>
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 top-full mt-2 ${dropdownWidth} max-h-72 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1.5 space-y-1 text-xs sm:text-sm animate-fadeIn`}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-left transition-all ${
                selectedValue === opt.value
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                  : `${opt.color || 'text-slate-700'} hover:bg-slate-50 hover:text-slate-900 border border-transparent`
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0 pr-2">
                {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                <span className="leading-snug break-words">{opt.label}</span>
              </span>
              {selectedValue === opt.value && <Check size={14} className="text-blue-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

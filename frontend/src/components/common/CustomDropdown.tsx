import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  color?: string;
}

export interface CustomDropdownProps<T extends string = string> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (val: T) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  dropdownWidth?: string;
  alignRight?: boolean;
  className?: string;
  buttonClassName?: string;
}

export function CustomDropdown<T extends string = string>({
  options,
  value,
  onChange,
  icon,
  placeholder = 'Select option',
  searchable = false,
  searchPlaceholder = 'Search options...',
  dropdownWidth = 'w-56',
  alignRight = true,
  className = '',
  buttonClassName = '',
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchable || !filterQuery.trim()) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
        opt.value.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [options, filterQuery, searchable]);

  return (
    <div className={`relative inline-block ${isOpen ? 'z-[100]' : 'z-10'} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 border shadow-sm rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
          isOpen
            ? 'bg-blue-600/20 border-blue-500 text-blue-300 ring-2 ring-blue-500/20 shadow-blue-500/10'
            : 'bg-[#0F172A]/90 border-slate-700/80 text-slate-200 hover:border-slate-600 hover:bg-[#131C35] hover:text-white'
        } ${buttonClassName}`}
      >
        <span className="flex items-center gap-2 truncate min-w-0">
          {icon || (selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>)}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${alignRight ? 'right-0' : 'left-0'} top-full mt-2 ${dropdownWidth} max-h-64 overflow-y-auto bg-[#0F172A] border border-slate-700/90 rounded-2xl shadow-2xl backdrop-blur-2xl z-[100] p-1.5 space-y-1 text-xs animate-fadeIn scrollbar-thin scrollbar-thumb-slate-700`}
        >
          {searchable && (
            <div className="p-1 mb-1 border-b border-slate-800 sticky top-0 bg-[#0F172A] z-[101]">
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-950 rounded-xl border border-slate-700/80">
                <Search size={13} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
                  autoFocus
                />
                {filterQuery && (
                  <button onClick={() => setFilterQuery('')} className="text-slate-500 hover:text-white">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}

          {filteredOptions.length === 0 ? (
            <div className="px-3 py-3 text-slate-500 text-center italic text-xs">No matching options found</div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setFilterQuery('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-medium transition-all duration-150 ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-bold'
                      : `${opt.color || 'text-slate-300'} hover:bg-slate-800/80 hover:text-white`
                  }`}
                >
                  <span className="flex items-center gap-2 truncate pr-2">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    {opt.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-400 rounded-md border border-slate-700">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && <Check size={14} className="text-blue-400 shrink-0" />}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from './icon';

type Option = { label: string; value: string };

type FormDropdownProps = {
  value?: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

export function FormDropdown({
  value,
  options,
  placeholder = '',
  onChange,
}: FormDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selected = options.find((o) => o.value === value);
  const hasValue = !!selected;

  const triggerClass = `flex h-[52px] w-full items-center justify-between rounded-[10px] px-[20px] text-left ${
    hasValue
      ? 'bg-white border border-[#b3b3b3] text-[#333]'
      : 'bg-[#fbfbfb] text-[#666]'
  }`;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        className={triggerClass}
        onClick={() => setOpen(!open)}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <Icon name="chevron-down" size={16} />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-[10px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)]">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="w-full px-[20px] py-[10px] text-left text-[#333] hover:bg-[#fbfbfb]"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from './icon';

type LangPickerProps = {
  value: string;
  onChange: (lang: string) => void;
  options: string[];
};

export function LangPicker({ value, onChange, options }: LangPickerProps) {
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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="flex items-center gap-1 text-[18px]"
        onClick={() => setOpen(!open)}
      >
        <span>{value}</span>
        <Icon name="chevron-down" size={14} />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-[80px] rounded-[10px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)]">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className="w-full px-3 py-2 text-left text-[16px] text-[#333] hover:bg-[#fbfbfb]"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';

type DialcodePickerProps = {
  value: string;
  onChange: (code: string) => void;
};

const DIAL_CODES = [
  '+1',
  '+44',
  '+49',
  '+61',
  '+81',
  '+82',
  '+84',
  '+86',
  '+91',
];

export function DialcodePicker({ value, onChange }: DialcodePickerProps) {
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
        className="flex items-center text-[16px] text-[#333]"
        onClick={() => setOpen(!open)}
      >
        {value}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 max-h-[200px] overflow-y-auto rounded-[10px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)]">
          {DIAL_CODES.map((code) => (
            <button
              key={code}
              type="button"
              className="w-full px-4 py-2 text-left text-[16px] text-[#333] hover:bg-[#fbfbfb]"
              onClick={() => {
                onChange(code);
                setOpen(false);
              }}
            >
              {code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

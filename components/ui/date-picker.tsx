'use client';

import { useState, useRef, useEffect, useMemo } from 'react';

type DatePickerProps = {
  type?: 'full' | 'month';
  value?: Date;
  onChange: (date: Date) => void;
  required?: boolean;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatDate(date: Date, type: 'full' | 'month') {
  const d = date.getUTCDate();
  const m = date.getUTCMonth() + 1;
  const y = date.getUTCFullYear();
  return type === 'full' ? `${pad(d)}.${pad(m)}.${y}` : `${pad(m)}.${y}`;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 50 }, (_, i) => 2030 - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

function ScrollColumn({
  items,
  selected,
  onSelect,
  format,
}: {
  items: number[];
  selected: number;
  onSelect: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div className="flex h-[160px] flex-col gap-1 overflow-y-auto px-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={`rounded-[5px] px-3 py-1 text-center text-[14px] ${
            item === selected
              ? 'bg-[#ffefe5] font-medium text-[#ff6000]'
              : 'text-[#333] hover:bg-[#fbfbfb]'
          }`}
          onClick={() => onSelect(item)}
        >
          {format ? format(item) : item}
        </button>
      ))}
    </div>
  );
}

export function DatePicker({
  type = 'full',
  value,
  onChange,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const now = useMemo(() => new Date(), []);
  const [selDay, setSelDay] = useState(
    value ? value.getUTCDate() : now.getUTCDate()
  );
  const [selMonth, setSelMonth] = useState(
    value ? value.getUTCMonth() + 1 : now.getUTCMonth() + 1
  );
  const [selYear, setSelYear] = useState(
    value ? value.getUTCFullYear() : now.getUTCFullYear()
  );

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const hasValue = !!value;
  const placeholder = type === 'full' ? 'DD.MM.YYYY' : 'MM.YYYY';

  function handleSelect() {
    const date = new Date(
      Date.UTC(selYear, selMonth - 1, type === 'full' ? selDay : 1)
    );
    onChange(date);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className={`flex h-[52px] items-center rounded-[10px] px-[20px] text-left ${
          hasValue
            ? 'border border-[#b3b3b3] bg-white text-[#333]'
            : 'bg-[#fbfbfb] text-[#999]'
        }`}
        onClick={() => setOpen(!open)}
      >
        {hasValue ? formatDate(value, type) : placeholder}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 rounded-[10px] bg-white p-4 shadow-[0_0_10px_rgba(0,0,0,0.05)]">
          <div className="flex gap-2">
            {type === 'full' && (
              <ScrollColumn
                items={DAYS}
                selected={selDay}
                onSelect={setSelDay}
                format={pad}
              />
            )}
            <ScrollColumn
              items={MONTHS}
              selected={selMonth}
              onSelect={setSelMonth}
              format={pad}
            />
            <ScrollColumn
              items={YEARS}
              selected={selYear}
              onSelect={setSelYear}
            />
          </div>
          <button
            type="button"
            className="mt-3 w-full rounded-[60px] bg-[#ff6000] py-2 text-center text-white"
            onClick={handleSelect}
          >
            Select
          </button>
        </div>
      )}
    </div>
  );
}

import { Icon } from './icon';

type SearchBarProps = {
  variant?: 'main' | 'skills';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const VARIANT_CLASS = {
  main: 'border border-[#b3b3b3] rounded-[60px] h-[50px] px-[20px] bg-white',
  skills: 'bg-[#fbfbfb] rounded-[999px] h-[52px] px-[20px] pl-[44px]',
} as const;

export function SearchBar({
  variant = 'main',
  value,
  onChange,
  placeholder,
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      {variant === 'skills' && (
        <span className="pointer-events-none absolute top-1/2 left-[16px] -translate-y-1/2">
          <Icon name="search" size={20} />
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full text-[16px] text-[#333] outline-none placeholder:text-[#999] ${VARIANT_CLASS[variant]}`}
      />
    </div>
  );
}

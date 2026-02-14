import { Icon } from './icon';

type ChipVariant = 'displayed' | 'searched' | 'selected';
type ChipSize = 'sm' | 'md';

type ChipProps = {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  onRemove?: () => void;
  onSelect?: () => void;
};

const VARIANT_CLASS: Record<ChipVariant, string> = {
  displayed: 'border-[#b3b3b3] bg-white',
  searched: 'border-[#b3b3b3] bg-white',
  selected: 'border-[#ff904c] bg-white',
};

const SIZE_CLASS: Record<ChipSize, string> = {
  sm: 'px-[8px] py-[6px] rounded-[5px] text-[14px]',
  md: 'px-[10px] py-[8px] rounded-[8px] text-[16px]',
};

export function Chip({
  label,
  variant = 'displayed',
  size = 'sm',
  onRemove,
  onSelect,
}: ChipProps) {
  const Tag = onSelect ? 'button' : 'span';

  return (
    <Tag
      data-slot="chip"
      className={`inline-flex items-center gap-1 border ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]}`}
      {...(onSelect ? { type: 'button' as const, onClick: onSelect } : {})}
    >
      {variant === 'selected' && <Icon name="checked" size={14} />}
      <span>{label}</span>
      {variant === 'searched' && onRemove && (
        <button type="button" onClick={onRemove} className="ml-0.5">
          <Icon name="close" size={14} />
        </button>
      )}
    </Tag>
  );
}

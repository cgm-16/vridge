import { Icon } from './icon';

type PostStatusProps = {
  status: 'recruiting' | 'done';
  size?: 'sm' | 'md';
  label?: string;
};

const CONFIG = {
  recruiting: {
    icon: 'status-recruiting',
    color: 'text-[#00a600]',
    defaultLabel: 'Recruiting',
  },
  done: {
    icon: 'status-done',
    color: 'text-[#e50000]',
    defaultLabel: 'Done',
  },
} as const;

const SIZE_CLASS = {
  sm: 'text-[12px]',
  md: 'text-[14px]',
} as const;

export function PostStatus({ status, size = 'sm', label }: PostStatusProps) {
  const config = CONFIG[status];
  const displayLabel = label ?? config.defaultLabel;

  return (
    <span className="inline-flex items-center justify-center">
      <Icon name={config.icon} size={18} />
      <span
        className={`leading-[1.5] font-medium ${config.color} ${SIZE_CLASS[size]}`}
      >
        {displayLabel}
      </span>
    </span>
  );
}

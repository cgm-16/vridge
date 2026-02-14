import { Icon } from './icon';

type SectionTitleProps = {
  title: string;
  onAdd?: () => void;
};

export function SectionTitle({ title, onAdd }: SectionTitleProps) {
  return (
    <div className="border-b pb-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-[#1a1a1a]">{title}</h2>
        {onAdd && (
          <button type="button" onClick={onAdd}>
            <Icon name="plus" size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

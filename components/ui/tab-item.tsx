import Link from 'next/link';

type TabItemProps = {
  label: string;
  isActive: boolean;
  href: string;
};

export function TabItem({ label, isActive, href }: TabItemProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-2 pb-2 text-[22px] font-medium transition-colors ${
        isActive
          ? 'border-b border-[#ff6000] font-bold text-[#ff6000]'
          : 'border-b border-transparent text-[#333] hover:rounded-[130px] hover:bg-[#ffefe5] hover:text-[#1a1a1a]'
      }`}
    >
      {label}
    </Link>
  );
}

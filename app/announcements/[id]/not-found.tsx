import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AnnouncementNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-3 px-6 py-10 text-center">
      <h1 className="text-2xl font-semibold text-[#1a1a1a]">
        공지사항을 찾을 수 없습니다.
      </h1>
      <p className="text-sm text-[#666]">
        삭제되었거나 접근할 수 없는 공지입니다.
      </p>
      <Button asChild variant="brand" size="brand-sm">
        <Link href="/announcements">목록으로 이동</Link>
      </Button>
    </div>
  );
}

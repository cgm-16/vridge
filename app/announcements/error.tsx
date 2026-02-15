'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AnnouncementsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-3 px-6 py-10 text-center">
      <h1 className="text-2xl font-semibold text-[#1a1a1a]">
        공지사항을 불러오지 못했습니다.
      </h1>
      <p className="text-sm text-[#666]">
        네트워크 상태를 확인한 뒤 다시 시도해 주세요.
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="brand-outline"
          size="brand-sm"
          onClick={reset}
        >
          다시 시도
        </Button>
        <Button asChild variant="brand" size="brand-sm">
          <Link href="/announcements">목록으로 이동</Link>
        </Button>
      </div>
    </div>
  );
}

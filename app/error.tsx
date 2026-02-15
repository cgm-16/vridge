'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
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
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-[#1a1a1a]">
        문제가 발생했습니다.
      </h1>
      <p className="text-sm text-[#666]">잠시 후 다시 시도해 주세요.</p>
      <Button type="button" variant="brand" size="brand-md" onClick={reset}>
        다시 시도
      </Button>
    </div>
  );
}

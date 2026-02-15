import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalNotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-[#1a1a1a]">
        페이지를 찾을 수 없습니다.
      </h1>
      <p className="text-sm text-[#666]">
        요청하신 페이지가 없거나 이동되었습니다.
      </p>
      <Button asChild variant="brand" size="brand-md">
        <Link href="/jobs">채용공고로 이동</Link>
      </Button>
    </div>
  );
}

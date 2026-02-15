import { Skeleton } from '@/components/ui/skeleton';

export default function AnnouncementDetailLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-7 px-6 py-10">
      <Skeleton className="h-6 w-6" />

      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-5 w-48" />
      </div>

      <div className="bg-neutral-50 rounded-[20px] px-5 py-6">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[90%]" />
        </div>
      </div>

      <div className="flex flex-col border-y border-black">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`announcement-detail-loading-nav-${index}`}
            className="grid grid-cols-[96px_1fr_192px] items-center gap-4 border-b border-black py-5 last:border-b-0"
          >
            <Skeleton className="mx-auto h-5 w-14" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="mx-auto h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

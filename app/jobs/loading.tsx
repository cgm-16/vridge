import { Skeleton } from '@/components/ui/skeleton';

export default function JobsLoading() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-8">
      <Skeleton className="h-12 w-full" />

      <div className="flex items-start justify-between gap-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`jobs-loading-item-${index}`}
            className="rounded-[20px] border border-[#ffefe5] bg-white px-[40px] py-[20px]"
          >
            <div className="flex items-start gap-4">
              <Skeleton className="h-[40px] w-[40px]" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-72" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  );
}

import { Skeleton } from '@/components/ui/skeleton';

export default function CandidateApplicationsLoading() {
  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <Skeleton className="h-9 w-40" />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Skeleton className="h-[120px] rounded-[20px]" />
        <Skeleton className="h-[120px] rounded-[20px]" />
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-24" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`candidate-applications-loading-item-${index}`}
            className="rounded-[20px] border border-[#ffefe5] bg-white px-[40px] py-[20px]"
          >
            <div className="flex items-start gap-4">
              <Skeleton className="h-[40px] w-[40px]" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-72" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

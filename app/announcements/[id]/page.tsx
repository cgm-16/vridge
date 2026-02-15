import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@/components/ui/icon';
import {
  getAnnouncementById,
  getAnnouncementNeighbors,
} from '@/lib/actions/announcements';

function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [detailResult, neighborsResult] = await Promise.all([
    getAnnouncementById(id),
    getAnnouncementNeighbors(id),
  ]);

  if ('error' in detailResult) {
    return <p className="p-6 text-destructive">{detailResult.error}</p>;
  }

  if ('error' in neighborsResult) {
    return <p className="p-6 text-destructive">{neighborsResult.error}</p>;
  }

  const announcement = detailResult.data;
  const neighbors = neighborsResult.data;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-7 px-6 py-10">
      <Link
        href="/announcements"
        aria-label="announcement 목록"
        className="inline-flex w-fit items-center text-black hover:text-brand"
      >
        <Icon name="arrow-left" size={24} />
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{announcement.title}</h1>
        <div className="inline-flex items-center gap-2 text-sm font-medium text-[#666]">
          {announcement.isPinned && <span>(Pinned)</span>}
          <span>{formatDate(announcement.createdAt)}</span>
        </div>
      </div>

      <div className="bg-neutral-50 rounded-[20px] px-5 py-6">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{announcement.content}</ReactMarkdown>
        </div>
      </div>

      <div className="flex flex-col border-y border-black">
        <div className="grid grid-cols-[96px_1fr_192px] items-center gap-4 border-b border-black py-5 text-sm font-medium text-[#666]">
          <span className="text-center">Next</span>
          {neighbors.next ? (
            <Link
              href={`/announcements/${neighbors.next.id}`}
              className="hover:text-brand"
            >
              {neighbors.next.title}
            </Link>
          ) : (
            <span className="text-[#999]">다음 공지 없음</span>
          )}
          <span className="text-center">
            {neighbors.next ? formatDate(neighbors.next.createdAt) : '-'}
          </span>
        </div>

        <div className="grid grid-cols-[96px_1fr_192px] items-center gap-4 py-5 text-sm font-medium text-[#666]">
          <span className="text-center">Before</span>
          {neighbors.before ? (
            <Link
              href={`/announcements/${neighbors.before.id}`}
              className="hover:text-brand"
            >
              {neighbors.before.title}
            </Link>
          ) : (
            <span className="text-[#999]">이전 공지 없음</span>
          )}
          <span className="text-center">
            {neighbors.before ? formatDate(neighbors.before.createdAt) : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}

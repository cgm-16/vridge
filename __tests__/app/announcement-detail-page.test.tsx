import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import AnnouncementDetailPage from '@/app/announcements/[id]/page';
import {
  getAnnouncementById,
  getAnnouncementNeighbors,
} from '@/lib/actions/announcements';
import { notFound } from 'next/navigation';

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/lib/actions/announcements', () => ({
  getAnnouncementById: jest.fn(),
  getAnnouncementNeighbors: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

const mockGetAnnouncementById = getAnnouncementById as unknown as jest.Mock;
const mockGetAnnouncementNeighbors =
  getAnnouncementNeighbors as unknown as jest.Mock;
const mockNotFound = notFound as unknown as jest.Mock;

describe('AnnouncementDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('상세/핀/Next-Before 영역을 렌더링한다', async () => {
    mockGetAnnouncementById.mockResolvedValue({
      success: true,
      data: {
        id: 'ann-1',
        title: 'About Vridge',
        content: '안내 본문',
        isPinned: true,
        createdAt: new Date('2026-02-06T00:00:00.000Z'),
        updatedAt: new Date('2026-02-06T00:00:00.000Z'),
      },
    });
    mockGetAnnouncementNeighbors.mockResolvedValue({
      success: true,
      data: {
        next: {
          id: 'ann-2',
          title: '다음 공지',
          isPinned: false,
          createdAt: new Date('2026-03-18T00:00:00.000Z'),
        },
        before: {
          id: 'ann-0',
          title: '이전 공지',
          isPinned: false,
          createdAt: new Date('2026-02-14T00:00:00.000Z'),
        },
      },
    });

    const ui = await AnnouncementDetailPage({
      params: Promise.resolve({ id: 'ann-1' }),
    });
    render(ui);

    expect(screen.getByText('About Vridge')).toBeInTheDocument();
    expect(screen.getByText('(Pinned)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '다음 공지' })).toHaveAttribute(
      'href',
      '/announcements/ann-2'
    );
    expect(screen.getByRole('link', { name: '이전 공지' })).toHaveAttribute(
      'href',
      '/announcements/ann-0'
    );
    expect(
      screen.getByRole('link', { name: /announcement 목록/i })
    ).toHaveAttribute('href', '/announcements');
  });

  it('NOT_FOUND 에러 코드면 notFound를 호출한다', async () => {
    mockGetAnnouncementById.mockResolvedValue({
      error: '공지사항을 찾을 수 없습니다',
      errorCode: 'NOT_FOUND',
    });
    mockGetAnnouncementNeighbors.mockResolvedValue({
      success: true,
      data: { next: null, before: null },
    });
    mockNotFound.mockImplementation(() => {
      throw new Error('NEXT_HTTP_ERROR_FALLBACK;404');
    });

    await expect(
      AnnouncementDetailPage({ params: Promise.resolve({ id: 'missing' }) })
    ).rejects.toThrow('NEXT_HTTP_ERROR_FALLBACK;404');
    expect(mockNotFound).toHaveBeenCalled();
  });

  it('NOT_FOUND가 아닌 에러는 에러 바운더리로 전파한다', async () => {
    mockGetAnnouncementById.mockResolvedValue({
      error: '일시적인 오류입니다',
      errorCode: 'CONFLICT',
    });
    mockGetAnnouncementNeighbors.mockResolvedValue({
      success: true,
      data: { next: null, before: null },
    });

    await expect(
      AnnouncementDetailPage({ params: Promise.resolve({ id: 'ann-1' }) })
    ).rejects.toThrow('일시적인 오류입니다');
    expect(mockNotFound).not.toHaveBeenCalled();
  });
});

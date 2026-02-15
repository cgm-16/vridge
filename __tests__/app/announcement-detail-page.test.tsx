import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import AnnouncementDetailPage from '@/app/announcements/[id]/page';
import {
  getAnnouncementById,
  getAnnouncementNeighbors,
} from '@/lib/actions/announcements';

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/lib/actions/announcements', () => ({
  getAnnouncementById: jest.fn(),
  getAnnouncementNeighbors: jest.fn(),
}));

const mockGetAnnouncementById = getAnnouncementById as unknown as jest.Mock;
const mockGetAnnouncementNeighbors =
  getAnnouncementNeighbors as unknown as jest.Mock;

describe('AnnouncementDetailPage', () => {
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
});

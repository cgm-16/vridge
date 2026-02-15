import { render, screen } from '@testing-library/react';
import AnnouncementsPage from '@/app/announcements/page';
import { getAnnouncements } from '@/lib/actions/announcements';

jest.mock('@/lib/actions/announcements', () => ({
  getAnnouncements: jest.fn(),
}));

const mockGetAnnouncements = getAnnouncements as unknown as jest.Mock;

describe('AnnouncementsPage', () => {
  it('공지 목록과 번호/핀 표시를 렌더링한다', async () => {
    mockGetAnnouncements.mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            id: 'ann-pinned',
            title: '핀 공지',
            content: '내용',
            isPinned: true,
            createdAt: new Date('2026-02-06T00:00:00.000Z'),
            updatedAt: new Date('2026-02-06T00:00:00.000Z'),
          },
          {
            id: 'ann-normal',
            title: '일반 공지',
            content: '내용',
            isPinned: false,
            createdAt: new Date('2026-02-05T00:00:00.000Z'),
            updatedAt: new Date('2026-02-05T00:00:00.000Z'),
          },
        ],
        total: 10,
        page: 1,
        pageSize: 20,
      },
    });

    const ui = await AnnouncementsPage({
      searchParams: Promise.resolve({ page: '1' }),
    });
    render(ui);

    expect(screen.getByText('Announcement')).toBeInTheDocument();
    expect(screen.getByText('📍')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '일반 공지' })).toHaveAttribute(
      'href',
      '/announcements/ann-normal'
    );
    expect(screen.getByText('9')).toBeInTheDocument();
  });
});

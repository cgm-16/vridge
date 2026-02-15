import { screen } from '@testing-library/react';
import { ProfileCard } from '@/entities/profile/ui/profile-card';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

const baseProps = {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date(Date.UTC(1990, 0, 15)),
  phone: '+82 10-1234-5678',
  email: 'john@example.com',
  location: 'Seoul',
  headline: 'Experienced developer looking for new opportunities',
  aboutMe: 'Building reliable web products',
};

describe('ProfileCard', () => {
  it('이름 렌더링', () => {
    renderWithI18n(<ProfileCard {...baseProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('연락처와 위치 렌더링', () => {
    renderWithI18n(<ProfileCard {...baseProps} />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('+82 10-1234-5678')).toBeInTheDocument();
    expect(screen.getByText('Seoul')).toBeInTheDocument();
  });

  it('aboutMe와 headline 렌더링', () => {
    renderWithI18n(<ProfileCard {...baseProps} />);
    expect(
      screen.getByText('Building reliable web products')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Experienced developer looking for new opportunities')
    ).toBeInTheDocument();
  });

  it('isOpenToWork=true 이면 recruiting 상태 표시', () => {
    renderWithI18n(<ProfileCard {...baseProps} isOpenToWork />);
    expect(screen.getByText('Open to Work')).toBeInTheDocument();
  });

  it('isOpenToWork=false 이면 done 상태 표시', () => {
    renderWithI18n(<ProfileCard {...baseProps} isOpenToWork={false} />);
    expect(screen.getByText('Not Open to Work')).toBeInTheDocument();
  });

  it('ko 로케일에서 상태 문구가 현지화된다', () => {
    renderWithI18n(<ProfileCard {...baseProps} isOpenToWork />, {
      locale: 'ko',
    });
    expect(screen.getByText('구직 중')).toBeInTheDocument();
  });

  it('ko 로케일에서 비구직 상태 문구가 현지화된다', () => {
    renderWithI18n(<ProfileCard {...baseProps} isOpenToWork={false} />, {
      locale: 'ko',
    });
    expect(screen.getByText('구직 아님')).toBeInTheDocument();
  });

  it('생년월일 월 표기가 로케일에 따라 달라진다', () => {
    renderWithI18n(<ProfileCard {...baseProps} />, { locale: 'ko' });
    expect(screen.getByText(/1월/)).toBeInTheDocument();
    expect(screen.queryByText('15. Jan. 1990')).not.toBeInTheDocument();
  });

  it('profileImageUrl 없으면 기본 프로필 아이콘 fallback 표시', () => {
    renderWithI18n(<ProfileCard {...baseProps} />);
    expect(screen.getByAltText('Profile photo')).toBeInTheDocument();
  });

  it('profileImageUrl 있으면 프로필 이미지 엘리먼트 렌더링', () => {
    renderWithI18n(
      <ProfileCard
        {...baseProps}
        profileImageUrl="https://example.com/profile.jpg"
      />
    );
    expect(screen.getByAltText('John Doe profile image')).toBeInTheDocument();
  });
});

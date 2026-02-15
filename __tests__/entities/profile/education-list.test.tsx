import { render, screen } from '@testing-library/react';
import { EducationList } from '@/entities/profile/ui/education-list';

const baseEducation = {
  id: 'edu-1',
  institutionName: '서울대학교',
  educationType: 'higher_bachelor',
  field: 'Computer Science',
  graduationStatus: 'GRADUATED',
  startDate: new Date('2018-03-01'),
  endDate: new Date('2022-02-01'),
  sortOrder: 0,
};

describe('EducationList', () => {
  it('기관/유형/상태/기간 렌더링', () => {
    render(<EducationList educations={[baseEducation]} />);
    expect(screen.getByText('서울대학교')).toBeInTheDocument();
    expect(screen.getByText('학사')).toBeInTheDocument();
    expect(screen.getByText('졸업')).toBeInTheDocument();
    expect(screen.getByText(/2018\.03/)).toBeInTheDocument();
    expect(screen.getByText(/2022\.02/)).toBeInTheDocument();
  });

  it('유형/상태를 chip으로 렌더링', () => {
    const { container } = render(
      <EducationList educations={[baseEducation]} />
    );
    expect(container.querySelectorAll('[data-slot="chip"]')).toHaveLength(2);
  });

  it('전공이 있으면 전공 렌더링', () => {
    render(<EducationList educations={[baseEducation]} />);
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
  });

  it('endDate가 없으면 현재 렌더링', () => {
    render(
      <EducationList educations={[{ ...baseEducation, endDate: null }]} />
    );
    expect(screen.getByText(/현재/)).toBeInTheDocument();
  });

  it('알 수 없는 유형/상태는 원본 값 fallback', () => {
    render(
      <EducationList
        educations={[
          {
            ...baseEducation,
            educationType: 'custom_type',
            graduationStatus: 'custom_status',
          },
        ]}
      />
    );
    expect(screen.getByText('custom_type')).toBeInTheDocument();
    expect(screen.getByText('custom_status')).toBeInTheDocument();
  });

  it('빈 목록이면 empty 상태 렌더링', () => {
    render(<EducationList educations={[]} />);
    expect(screen.getByText('학력 없음')).toBeInTheDocument();
  });
});

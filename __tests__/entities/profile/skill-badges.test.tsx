import { render, screen } from '@testing-library/react';
import { SkillBadges } from '@/entities/profile/ui/skill-badges';

describe('SkillBadges', () => {
  it('renders each skill displayNameEn', () => {
    const skills = [
      { skill: { displayNameEn: 'TypeScript' } },
      { skill: { displayNameEn: 'React' } },
    ];
    const { container } = render(<SkillBadges skills={skills} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="chip"]')).toHaveLength(2);
  });

  it('renders empty state when skills is empty', () => {
    render(<SkillBadges skills={[]} />);
    expect(screen.getByText('등록된 스킬 없음')).toBeInTheDocument();
  });
});

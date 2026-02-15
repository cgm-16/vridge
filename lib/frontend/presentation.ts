export function formatDate(date: Date): string {
  return `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: '정규직',
  part_time: '파트타임',
  intern: '인턴',
  freelance: '프리랜서',
};

export const PROFICIENCY_LABELS: Record<string, string> = {
  native: '원어민',
  fluent: '유창',
  professional: '업무 가능',
  basic: '기초',
};

export const GRADUATION_STATUS_LABELS: Record<string, string> = {
  ENROLLED: '재학 중',
  ON_LEAVE: '휴학',
  GRADUATED: '졸업',
  EXPECTED: '졸업 예정',
  WITHDRAWN: '중퇴',
};

export const EXPERIENCE_LEVEL_LABELS: Record<string, string> = {
  ENTRY: 'Entry',
  JUNIOR: 'Junior',
  MID: 'Mid',
  SENIOR: 'Senior',
  LEAD: 'Lead',
};

export const EDUCATION_TYPE_LABELS: Record<string, string> = {
  vet_elementary: '직업 초급',
  vet_intermediate: '직업 중급',
  vet_college: '직업 대학',
  higher_bachelor: '학사',
  higher_master: '석사',
  higher_doctorate: '박사',
  continuing_education: '평생교육',
  international_program: '국제 프로그램',
  other: '기타',
};

export const WORK_ARRANGEMENT_LABELS: Record<string, string> = {
  onsite: '오피스',
  hybrid: '하이브리드',
  remote: '원격',
};

export const APPLY_STATUS_LABELS: Record<string, string> = {
  applied: '지원완료',
  accepted: '합격',
  rejected: '불합격',
  withdrawn: '취소',
};

const PERIOD_LABELS: Record<string, string> = {
  year: '년',
  month: '월',
  hour: '시',
};

export function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
  period: string,
  isNegotiable: boolean
): string {
  if (isNegotiable) return '협의';
  if (!min && !max) return '비공개';
  const fmt = (n: number) =>
    currency === 'VND' && n >= 1_000_000
      ? `${Math.round(n / 1_000_000)}M`
      : n.toLocaleString();
  const parts = [min && fmt(min), max && fmt(max)].filter(Boolean);
  return `${parts.join(' - ')} ${currency}/${PERIOD_LABELS[period] ?? period}`;
}

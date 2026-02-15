import { Chip } from '@/components/ui/chip';
import {
  formatDate,
  EDUCATION_TYPE_LABELS,
  GRADUATION_STATUS_LABELS,
} from './_utils';

type Education = {
  id: string;
  institutionName: string;
  educationType: string;
  field: string | null;
  graduationStatus: string;
  startDate: Date;
  endDate: Date | null;
  sortOrder: number;
};

type Props = {
  educations: Education[];
};

export function EducationList({ educations }: Props) {
  if (educations.length === 0) {
    return <p className="text-muted-foreground">학력 없음</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {educations.map((edu) => (
        <li key={edu.id} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{edu.institutionName}</span>
            <Chip
              label={
                EDUCATION_TYPE_LABELS[edu.educationType] ?? edu.educationType
              }
              variant="displayed"
              size="sm"
            />
            <Chip
              label={
                GRADUATION_STATUS_LABELS[edu.graduationStatus] ??
                edu.graduationStatus
              }
              variant="displayed"
              size="sm"
            />
          </div>
          {edu.field && (
            <span className="text-sm text-muted-foreground">{edu.field}</span>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDate(edu.startDate)} ~{' '}
            {edu.endDate ? formatDate(edu.endDate) : '현재'}
          </span>
        </li>
      ))}
    </ul>
  );
}

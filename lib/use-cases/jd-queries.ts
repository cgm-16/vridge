import { prisma } from '@/lib/infrastructure/db';
import { notFound } from '@/lib/domain/errors';
import type { z } from 'zod';
import type { jobDescriptionFilterSchema } from '@/lib/validations/job-description';

const JD_INCLUDE = {
  job: { include: { family: true } },
  skills: { include: { skill: true } },
  org: true,
} as const;

export async function getJobDescriptions(
  filters: z.infer<typeof jobDescriptionFilterSchema>
) {
  const { jobId, employmentType, workArrangement, page, pageSize } = filters;

  const where = {
    ...(jobId !== undefined ? { jobId } : {}),
    ...(employmentType !== undefined ? { employmentType } : {}),
    ...(workArrangement !== undefined ? { workArrangement } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.jobDescription.findMany({
      where,
      include: JD_INCLUDE,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.jobDescription.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function getJobDescriptionById(id: string) {
  const jd = await prisma.jobDescription.findUnique({
    where: { id },
    include: JD_INCLUDE,
  });
  if (!jd) throw notFound('채용공고');
  return jd;
}

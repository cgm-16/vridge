'use server';

import { ZodError } from 'zod';
import { DomainError } from '@/lib/domain/errors';
import { jobDescriptionFilterSchema } from '@/lib/validations/job-description';
import {
  getJobDescriptions as ucGetJobDescriptions,
  getJobDescriptionById as ucGetJobDescriptionById,
} from '@/lib/use-cases/jd-queries';

type QueryResult<T> = { success: true; data: T } | { error: string };

function handleError(e: unknown): { error: string } {
  if (e instanceof DomainError) return { error: e.message };
  if (e instanceof ZodError) return { error: '필터 값이 유효하지 않습니다' };
  throw e;
}

export async function getJobDescriptions(
  input: unknown
): Promise<QueryResult<Awaited<ReturnType<typeof ucGetJobDescriptions>>>> {
  try {
    const filters = jobDescriptionFilterSchema.parse(input);
    const data = await ucGetJobDescriptions(filters);
    return { success: true, data };
  } catch (e) {
    return handleError(e);
  }
}

export async function getJobDescriptionById(
  id: string
): Promise<QueryResult<Awaited<ReturnType<typeof ucGetJobDescriptionById>>>> {
  try {
    const data = await ucGetJobDescriptionById(id);
    return { success: true, data };
  } catch (e) {
    return handleError(e);
  }
}

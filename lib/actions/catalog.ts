'use server';

import { DomainError } from '@/lib/domain/errors';
import * as catalogUC from '@/lib/use-cases/catalog';

type QueryResult<T> = { success: true; data: T } | { error: string };

function handleError(e: unknown): { error: string } {
  if (e instanceof DomainError) return { error: e.message };
  throw e;
}

export async function getJobFamilies(): Promise<
  QueryResult<Awaited<ReturnType<typeof catalogUC.getJobFamilies>>>
> {
  try {
    const data = await catalogUC.getJobFamilies();
    return { success: true, data };
  } catch (e) {
    return handleError(e);
  }
}

export async function getJobs(
  familyId?: string
): Promise<QueryResult<Awaited<ReturnType<typeof catalogUC.getJobs>>>> {
  try {
    const data = await catalogUC.getJobs(familyId);
    return { success: true, data };
  } catch (e) {
    return handleError(e);
  }
}

export async function searchSkills(
  query: string
): Promise<QueryResult<Awaited<ReturnType<typeof catalogUC.searchSkills>>>> {
  try {
    const data = await catalogUC.searchSkills(query);
    return { success: true, data };
  } catch (e) {
    return handleError(e);
  }
}

export async function getSkillById(
  id: string
): Promise<QueryResult<Awaited<ReturnType<typeof catalogUC.getSkillById>>>> {
  try {
    const data = await catalogUC.getSkillById(id);
    return { success: true, data };
  } catch (e) {
    return handleError(e);
  }
}

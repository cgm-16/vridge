import { redirect } from 'next/navigation';
import { getMyProfile } from '@/lib/actions/profile';
import { requireUser } from '@/lib/infrastructure/auth-utils';

export default async function CandidateProfilePage() {
  await requireUser();
  const result = await getMyProfile();

  if ('error' in result) {
    return <p className="text-destructive">{result.error}</p>;
  }

  const slug = result.data.profilePublic?.publicSlug;
  if (!slug) {
    return (
      <p className="text-destructive">프로필 공개 URL을 찾을 수 없습니다.</p>
    );
  }

  redirect(`/candidate/${slug}/profile`);
}

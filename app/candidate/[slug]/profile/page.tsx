import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SectionTitle } from '@/components/ui/section-title';
import { ProfileCard } from '@/entities/profile/ui/profile-card';
import { EducationList } from '@/entities/profile/ui/education-list';
import { SkillBadges } from '@/entities/profile/ui/skill-badges';
import { CareerList } from '@/entities/profile/ui/career-list';
import { CertificationList } from '@/entities/profile/ui/certification-list';
import { LanguageList } from '@/entities/profile/ui/language-list';
import { UrlList } from '@/entities/profile/ui/url-list';
import { getProfileBySlug } from '@/lib/actions/profile';

export default async function CandidatePublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getProfileBySlug(slug);

  if ('error' in result) {
    return <p className="p-6 text-destructive">{result.error}</p>;
  }

  const {
    authUser,
    profilePublic,
    careers,
    educations,
    languages,
    urls,
    profileSkills,
    certifications,
  } = result.data;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-8">
      <Card>
        <CardHeader>
          <SectionTitle title="Basic Profile" />
        </CardHeader>
        <CardContent>
          <ProfileCard
            firstName={profilePublic?.firstName ?? ''}
            lastName={profilePublic?.lastName ?? ''}
            dateOfBirth={profilePublic?.dateOfBirth ?? undefined}
            email={authUser?.email}
            location={profilePublic?.location}
            headline={profilePublic?.headline}
            aboutMe={profilePublic?.aboutMe}
            isOpenToWork={profilePublic?.isOpenToWork ?? false}
            profileImageUrl={profilePublic?.profileImageUrl}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="Education" />
        </CardHeader>
        <CardContent>
          <EducationList educations={educations} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="Skills" />
        </CardHeader>
        <CardContent>
          <SkillBadges skills={profileSkills} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="Experience" />
        </CardHeader>
        <CardContent>
          <CareerList careers={careers} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="Certification" />
        </CardHeader>
        <CardContent>
          <CertificationList certifications={certifications} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="Languages" />
        </CardHeader>
        <CardContent>
          <LanguageList languages={languages} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="Portfolio" />
        </CardHeader>
        <CardContent>
          <UrlList urls={urls} />
        </CardContent>
      </Card>
    </div>
  );
}

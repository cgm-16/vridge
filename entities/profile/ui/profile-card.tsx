'use client';

import Image from 'next/image';
import { Icon } from '@/components/ui/icon';
import { PostStatus } from '@/components/ui/post-status';
import { useI18n } from '@/lib/i18n/client';

type Props = {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phone?: string | null;
  email?: string | null;
  location?: string | null;
  headline?: string | null;
  aboutMe?: string | null;
  isOpenToWork?: boolean;
  profileImageUrl?: string | null;
};

function formatDob(date: Date, locale: string) {
  const day = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);
  const month = new Intl.DateTimeFormat(locale, {
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
  const year = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  return `${day}. ${month}. ${year}`;
}

export function ProfileCard({
  firstName,
  lastName,
  dateOfBirth,
  phone,
  email,
  location,
  headline,
  aboutMe,
  isOpenToWork = false,
  profileImageUrl,
}: Props) {
  const { locale, t } = useI18n();

  return (
    <div className="rounded-[20px] bg-[#fbfbfb] px-[40px] py-[30px]">
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-full bg-[#e6e6e6]">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                width={200}
                height={200}
                alt={`${firstName} ${lastName} profile image`}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <Icon name="profile" size={80} alt="Profile photo" />
            )}
          </div>
          <PostStatus
            status={isOpenToWork ? 'recruiting' : 'done'}
            label={
              isOpenToWork
                ? t('profile.openToWork')
                : t('profile.notOpenToWork')
            }
            size="sm"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <h2 className="text-[30px] font-bold text-[#1a1a1a]">
            {firstName} {lastName}
          </h2>
          {dateOfBirth && (
            <span className="text-[14px] text-[#808080]">
              {formatDob(dateOfBirth, locale)}
            </span>
          )}

          <div className="flex flex-col gap-1 text-[14px] text-[#4c4c4c]">
            {phone && (
              <span className="inline-flex items-center gap-2">
                <Icon name="mobile" size={16} />
                {phone}
              </span>
            )}
            {email && (
              <span className="inline-flex items-center gap-2">
                <Icon name="mail" size={16} />
                {email}
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-2">
                <Icon name="location" size={16} />
                {location}
              </span>
            )}
          </div>

          {aboutMe && <p className="text-[14px] text-[#4c4c4c]">{aboutMe}</p>}

          {headline && (
            <div className="rounded-[10px] bg-white p-[20px] text-[14px] text-[#333]">
              {headline}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

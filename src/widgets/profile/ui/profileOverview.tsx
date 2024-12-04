import { FollowingToggle } from "@/features/follow/ui";
import type {
  FollowerIdList,
  FollowingIdList,
  Nickname,
  PetInfo,
} from "@/entities/profile/api";
import {
  EmptyProfileImage,
  PetDescriptionText,
  PetPersonalityList,
  ProfileHeading,
  ProfileImage,
} from "@/entities/profile/ui";
import { Button } from "@/shared/ui/button";
import { InfoChip } from "@/shared/ui/chip/InfoChip";
import { DividerLine } from "@/shared/ui/divider";

interface ProfileOverviewProps {
  nickname: Nickname;
  pet: PetInfo;
  followersIds: FollowerIdList;
  followingsIds: FollowingIdList;
  isFollowing: boolean;
}

export const ProfileOverView = ({
  nickname,
  pet,
  followersIds,
  followingsIds,
  isFollowing,
}: ProfileOverviewProps) => {
  const { profile, name, breed, description, personalities } = pet;

  return (
    <section className="px-4 py-4 flex flex-col gap-4 rounded-2xl border border-grey-300 bg-grey-50 w-full">
      <div className="flex gap-4 self-stretch">
        {/* 프로필 이미지 */}
        {profile ? (
          <ProfileImage
            imageUrl={profile}
            nickname={nickname}
            size="xLarge"
            className="rounded-2xl"
          />
        ) : (
          <EmptyProfileImage size="xLarge" className="rounded-2xl" />
        )}
        {/* 프로필 정보 */}
        <ProfileHeading
          name={name}
          breed={breed}
          followersIds={followersIds}
          followingsIds={followingsIds}
        />
        <div className="flex flex-grow justify-end">
          <FollowingToggle
            nickname={nickname}
            isFollowing={isFollowing}
            size="xSmall"
          />
        </div>
      </div>
      {/* 반려동물 소개와 성격 리스트 */}
      {description && <PetDescriptionText description={description} />}
      {personalities.length > 0 && (
        <PetPersonalityList personalities={personalities} />
      )}
    </section>
  );
};

/**
 * 해당 컴포넌트는 다른 유저가 반려동물을 등록하지 않았을 때 :nickname 대시보드에서 나타나는 컴포넌트 입니다.
 */
export const EmptyProfileOverView = () => {
  return <div>다른 사람의 빈 페이지 ..</div>;
};

export const ProfileOverViewSkeleton = () => (
  <section className="px-4 py-4 flex flex-col gap-4 rounded-2xl border border-grey-300 bg-grey-50 w-full">
    <div className="flex gap-4 self-stretch">
      {/* 프로필 이미지 */}
      <div className="w-16 h-16 rounded-[1.75rem] object-cover skeleton" />
      {/* 프로필 정보 */}
      <div className="flex flex-col gap-1 items-start self-stretch">
        <h1 className="text-grey-900 title-2 skeleton">name</h1>
        <h2 className="text-grey-500 body-3 skeleton">breed breed</h2>
        <p className="text-grey-700 body-3 flex gap-2 items-center">
          <div>
            팔로워 <span className="skeleton">loading</span>
          </div>
          <DividerLine axis="col" />
          <div>
            팔로잉 <span className=" skeleton">loading</span>
          </div>
        </p>
      </div>
      <div className="flex flex-grow justify-end">
        <Button
          size="xSmall"
          variant="outlined"
          colorType="tertiary"
          fullWidth={false}
          disabled
          className="skeleton"
        >
          <div className="w-12" />
        </Button>
      </div>
    </div>
    {/* 반려동물 소개와 성격 리스트 */}
    <p className=" body-2  skeleton">
      description description description description
    </p>
    {/* PetPersonality */}
    <ul className="flex gap-2 self-stretch flex-wrap items-center content-center">
      {Array.from({ length: 3 }, (_, idx) => idx).map((key) => (
        <li key={key}>
          <InfoChip size="small" className="skeleton border-none">
            personality
          </InfoChip>
        </li>
      ))}
    </ul>
  </section>
);

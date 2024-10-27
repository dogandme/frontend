import { FollowingToggle } from "@/features/follow/ui";
import type {
  FollowerIdList,
  FollowingIdList,
  Nickname,
  PetInfo,
} from "@/entities/profile/api";
import {
  PetDescriptionText,
  PetPersonalityList,
  ProfileHeading,
  ProfileImage,
} from "@/entities/profile/ui";

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
        <ProfileImage profile={profile} nickname={nickname} />
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
            followingButtonType="default"
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

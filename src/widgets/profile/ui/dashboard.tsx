import { ProfileEditButton } from "@/features/auth/ui";
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
import { useNicknameParams } from "@/shared/lib/profile";

interface ProfileOverviewProps {
  nickname: Nickname;
  pet: PetInfo;
  followersIds: FollowerIdList;
  followingsIds: FollowingIdList;
}

export const ProfileOverView = ({
  nickname,
  pet,
  followersIds,
  followingsIds,
}: ProfileOverviewProps) => {
  const { profile, name, breed, description, personalities } = pet;
  const { isMyPage } = useNicknameParams();

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
        {/* TODO 내 페이지인지, 남의 페이지인지에 따라 다른 버튼을 보여줘야 함 */}
        {isMyPage ? <ProfileEditButton pet={pet} /> : <button>팔로잉</button>}
      </div>
      {/* 반려동물 소개와 성격 리스트 */}
      {description && <PetDescriptionText description={description} />}
      {personalities.length > 0 && (
        <PetPersonalityList personalities={personalities} />
      )}
    </section>
  );
};

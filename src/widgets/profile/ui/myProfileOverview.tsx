import { Link } from "react-router-dom";
import { ProfileEditButton } from "@/features/auth/ui";
import type { PetInfo, ProfileInfo } from "@/entities/profile/types/server";
import {
  PetDescriptionText,
  PetPersonalityList,
  ProfileHeading,
  ProfileImage,
  EmptyProfileImage,
} from "@/entities/profile/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { PlusIcon } from "@/shared/ui/icon";

interface ProfileOverviewProps
  extends Pick<ProfileInfo, "nickname" | "followersIds" | "followingsIds"> {
  pet: PetInfo;
}

export const MyProfileOverview = ({
  nickname,
  pet,
  followersIds,
  followingsIds,
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
          <ProfileEditButton pet={pet} />
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
 * 해당 컴포넌트는 사용자가 반려동물을 등록하지 않았을 때 MyPage에서 나타나는 컴포넌트 입니다.
 */
export const EmptyMyProfileOverView = () => {
  return (
    <Link
      to={ROUTER_PATH.SIGN_UP_PET_INFO}
      className="px-4 py-4 flex flex-col gap-4 rounded-2xl border border-grey-300 bg-grey-50 w-full items-center text-grey-500"
    >
      <PlusIcon />
      <p className="title-3">반려동물을 등록해 주세요</p>
    </Link>
  );
};

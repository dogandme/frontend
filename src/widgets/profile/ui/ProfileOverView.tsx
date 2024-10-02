import { Link } from "react-router-dom";
import {
  Breed,
  Description,
  Followers,
  Followings,
  Personalities,
  PetName,
  ProfileImageUrl,
} from "@/features/profile/api";
import {
  PetCharacterList,
  PetIntroduce,
  ProfileEditButton,
  ProfileImage,
  ProfileInfo,
} from "@/entities/profile/ui";
import { ROUTER_PATH } from "@/shared/constants";
import type { AuthStore } from "@/shared/store";
import { PlusIcon } from "@/shared/ui/icon";

interface ProfileOverViewProps extends Pick<AuthStore, "role"> {
  profile: ProfileImageUrl;
  description: Description;
  personalities: Personalities;
  name: PetName;
  breed: Breed;
  followers: Followers;
  followings: Followings;
}

export const ProfileOverView = ({
  role,
  profile,
  description,
  personalities,
  ...profileInfo
}: ProfileOverViewProps) => {
  if (role === "ROLE_USER") {
    return (
      <section className="px-4 py-4 flex flex-col gap-4 rounded-2xl border border-grey-300 bg-grey-50 w-full">
        <div className="flex gap-4 self-stretch">
          {/* 프로필 이미지 */}
          <ProfileImage src={profile} />
          {/* 프로필 정보 */}
          <ProfileInfo {...profileInfo} />
          <ProfileEditButton />
        </div>
        {/* 반려동물 소개와 성격 리스트 */}
        <PetIntroduce introduce={description} />
        <PetCharacterList characterList={personalities} />
      </section>
    );
  }

  const navigatePath =
    role === null
      ? ROUTER_PATH.LOGIN
      : role === "ROLE_NONE"
        ? ROUTER_PATH.SIGN_UP_USER_INFO
        : ROUTER_PATH.SIGN_UP_PET_INFO;

  return (
    <Link
      to={navigatePath}
      className="px-4 py-4 flex flex-col gap-4 rounded-2xl border border-grey-300 bg-grey-50 w-full items-center text-grey-500"
    >
      <PlusIcon />
      <p className="title-3">반려동물을 등록해 주세요</p>
    </Link>
  );
};

import { Link } from "react-router-dom";
import { UserInfo } from "@/entities/profile/api";
import {
  PetCharacterList,
  PetIntroduce,
  ProfileEditButton,
  ProfileHeading,
  ProfileImage,
} from "@/entities/profile/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { PlusIcon } from "@/shared/ui/icon";

/**
 * ProfileOverView는 NonNullable 한 useGetProfile의 반환값을 받아서 렌더링 됩니다.
 * 즉 해당 컴포넌트는 ROLE_USER 이상의 권한을 가진 사용자에게만 정상적으로 렌더링 됩니다.
 */
export type ProfileOverViewProps = Pick<
  UserInfo,
  "followers" | "followings" | "nickname"
> & {
  pet: NonNullable<UserInfo["pet"]>;
};

export const ProfileOverView = ({
  nickname,
  pet,
  followers,
  followings,
}: ProfileOverViewProps) => {
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
          followers={followers}
          followings={followings}
        />
        {/* TODO 내 페이지인지, 남의 페이지인지에 따라 다른 버튼을 보여줘야 함 */}
        <ProfileEditButton />
      </div>
      {/* 반려동물 소개와 성격 리스트 */}
      <PetIntroduce description={description} />
      <PetCharacterList personalities={personalities} />
    </section>
  );
};

/**
 * 해당 컴포넌트는 사용자가 반려동물을 등록하지 않았을 때 MyPage에서 나타나는 컴포넌트 입니다.
 * 사용자 권한에 따라 라우팅 경로가 달라집니다.
 */
export const EmptyMyProfileOverView = ({ role }: { role: string | null }) => {
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

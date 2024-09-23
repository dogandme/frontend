import { Link } from "react-router-dom";
import {
  PetIntroduce,
  ProfileEditButton,
  ProfileImage,
  ProfileInfo,
} from "@/entities/profile/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { PlusIcon } from "@/shared/ui/icon";

export const ProfileOverView = () => {
  const role = useAuthStore((state) => state.role);

  // TODO API 요청 받으면 변경하기
  const profileImage = "/default-image.png";
  const introduce = `안녕하세요 진짜로 너무나도 귀여운 강아지입니다. 사람을 좋아하고 이름은
뽀송인데 뽀송송이라고 불러요`;
  const characterList = ["활동적인", "사교적인", "온순한", "애교가 많은"];
  const profileInfo = {
    name: "뽀송이",
    breed: "푸들",
    follower: 100,
    following: 100,
  };

  if (role === "ROLE_USER") {
    return (
      <section className="px-4 py-4 flex flex-col gap-4 rounded-2xl border border-grey-300 bg-grey-50 w-full">
        <div className="flex gap-4 self-stretch">
          {/* 프로필 이미지 */}
          <ProfileImage src={profileImage} />
          {/* 프로필 정보 */}
          <ProfileInfo profileInfo={profileInfo} />
          <ProfileEditButton />
        </div>
        {/* 반려동물 소개와 성격 리스트 */}
        <PetIntroduce introduce={introduce} characterList={characterList} />
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

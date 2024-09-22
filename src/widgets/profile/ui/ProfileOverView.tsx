import {
  PetIntroduce,
  ProfileEditButton,
  ProfileImage,
  ProfileInfo,
} from "@/entities/profile/ui";

export const ProfileOverView = () => {
  return (
    <section className="px-4 py-4 flex flex-col gap-4 rounded-2xl border border-grey-300 bg-grey-50 w-full">
      <div className="flex gap-4 self-stretch">
        {/* 프로필 이미지 */}
        <ProfileImage src="/default-image.png" />
        {/* 프로필 정보 */}
        <ProfileInfo
          profileInfo={{
            name: "뽀송이",
            breed: "푸들",
            follower: 100,
            following: 100,
          }}
        />
        <ProfileEditButton />
      </div>
      {/* Pet description & characterList */}
      <PetIntroduce
        introduce={`안녕하세요 진짜로 너무나도 귀여운 강아지입니다. 사람을 좋아하고 이름은
          뽀송인데 뽀송송이라고 불러요`}
        characterList={["활동적인", "사교적인", "온순한", "애교가 많은"]}
      />
    </section>
  );
};

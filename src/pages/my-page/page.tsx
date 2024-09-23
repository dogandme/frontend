import { ProfileNavigationBar } from "@/widgets/profile/ui";
import { ProfileOverView } from "@/widgets/profile/ui";
import { TemporaryMarkingBar } from "@/entities/profile/ui";
import { GalleryGrid } from "@/entities/profile/ui/GalleryGrid";
import { useAuthStore } from "@/shared/store";

const exampleImages = [
  "https://picsum.photos/200",
  "https://picsum.photos/200",
  "https://picsum.photos/200",
  "https://picsum.photos/200",
  "https://picsum.photos/200",
];

export const MyPage = () => {
  const role = useAuthStore((state) => state.role);
  const nickname = useAuthStore((state) => state.nickname);

  // TODO MyPage API 요청 받아와 사용하기
  const profileOverViewResponse = {
    name: "뽀송이",
    breed: "비숑프리제",
    follower: 100,
    following: 100,
    introduce:
      "안녕하세요 진짜로 너무나도 귀여운 강아지입니다. 사람을 좋아하고 이름은 뽀송인데 뽀송송이라고 불러요",
    characterList: ["온순한", "활동적인", "호기심 많은", "애정이 많은"],
    profileImage: "/default-image.png",
  };
  const temporaryMarkingListResponse = ["path1", "path2", "path3"];

  return (
    <div>
      <ProfileNavigationBar role={role} nickname={nickname} />
      <section className="px-4 flex flex-col items-start gap-8">
        <ProfileOverView role={role} {...profileOverViewResponse} />
        <div className="flex flex-col items-start gap-2 w-full ">
          <h3 className="text-grey-900 text-center title-2">내 마킹</h3>
          <TemporaryMarkingBar
            role={role}
            temporaryMarkingList={temporaryMarkingListResponse}
          />
          <GalleryGrid
            role={role}
            images={exampleImages}
            profileImage={profileOverViewResponse.profileImage}
          />
        </div>
      </section>
    </div>
  );
};

import { ProfileNavigationBar } from "@/widgets/profile/ui";
import { ProfileOverView } from "@/widgets/profile/ui";
import { TemporaryMarkingBar } from "@/entities/profile/ui";
import { GalleryGrid } from "@/entities/profile/ui/GalleryGrid";

const exampleImages = [
  "https://picsum.photos/200",
  "https://picsum.photos/200",
  "https://picsum.photos/200",
  "https://picsum.photos/200",
  "https://picsum.photos/200",
];

// TODO MyPage API 요청 받아와 사용하기
export const MyPage = () => {
  return (
    <div>
      <ProfileNavigationBar />
      <section className="px-4 flex flex-col items-start gap-8">
        <ProfileOverView />
        <div className="flex flex-col items-start gap-2 w-full ">
          <h3 className="text-grey-900 text-center title-2">내 마킹</h3>
          <TemporaryMarkingBar />
          <GalleryGrid images={exampleImages} />
        </div>
      </section>
    </div>
  );
};

import { ProfileNavigationBar } from "@/widgets/profile/ui";
import { ProfileOverView } from "@/widgets/profile/ui";
import { TemporaryMarkingBar } from "@/entities/profifle/ui";
import { GalleryGrid } from "@/entities/profifle/ui/GalleryGrid";

const exampleImages = [
  "/default-image.png",
  "/default-image.png",
  "/default-image.png",
  "/default-image.png",
  "/default-image.png",
  "/default-image.png",
  "/default-image.png",
  "/default-image.png",
  "/default-image.png",
  "/default-image.png",
  "/default-image.png",
];

export const MyPage = () => {
  return (
    <div>
      <ProfileNavigationBar />
      <section className="px-4 flex flex-col items-start gap-8">
        <ProfileOverView />
        <div className="flex flex-col items-start gap-[10px] w-full ">
          <h3 className="text-grey-900 text-center title-2">내 마킹</h3>
          <TemporaryMarkingBar />
          <GalleryGrid images={exampleImages} />
        </div>
      </section>
    </div>
  );
};

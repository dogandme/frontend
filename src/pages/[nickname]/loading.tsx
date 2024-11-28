import { MarkingThumbnailGridSkeleton } from "@/widgets/marking/ui";
import { ProfileOverViewSkeleton } from "@/widgets/profile/ui";
import { useNicknameParams } from "@/shared/lib";
import { BackwardNavigationBar } from "@/shared/ui/navigationBar";

export const ProfilePageSkeleton = () => {
  const { nicknameParams, isMyPage } = useNicknameParams();

  return (
    <>
      <BackwardNavigationBar>{`${nicknameParams}님`}</BackwardNavigationBar>
      <section className="px-4 flex flex-col items-start gap-8">
        <ProfileOverViewSkeleton />
        <div className="flex flex-col items-start gap-2 w-full ">
          <h3 className="text-grey-900 text-center title-2">
            {isMyPage ? "내 마킹" : `${nicknameParams}님의 마킹`}
          </h3>
          <MarkingThumbnailGridSkeleton />
        </div>
      </section>
    </>
  );
};

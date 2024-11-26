import { MarkingThumbnailGrid } from "@/widgets/marking/ui";
import { ProfileOverView } from "@/widgets/profile/ui";
import { useGetProfile } from "@/entities/profile/api";
import { useGetMyProfile } from "@/entities/profile/api";
import { useNicknameParams } from "@/shared/lib";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";
import { ProfileLoadingPage } from "./loading";

export const OtherProfilePage = () => {
  const { nicknameParams } = useNicknameParams();
  const { data } = useGetProfile({
    nickname: nicknameParams,
  });
  const { data: myProfile } = useGetMyProfile();

  if (!data || !myProfile) {
    return <ProfileLoadingPage />;
  }

  const { followersIds, followingsIds, pet, userId } = data;

  return (
    <>
      <BackwardNavigationBar
        label={<h1 className="text-grey-900 title-1">{nicknameParams}님</h1>}
      />
      <section className="px-4 flex flex-col items-start gap-8">
        {pet ? (
          <ProfileOverView
            nickname={nicknameParams}
            followersIds={followersIds}
            followingsIds={followingsIds}
            pet={pet}
            isFollowing={myProfile.myFollowingIdsMap[userId]}
          />
        ) : (
          <EmptyOtherProfileOverView />
        )}
        <div className="flex flex-col items-start gap-2 w-full ">
          <h3 className="text-grey-900 text-center title-2">
            {nicknameParams}님의 마킹
          </h3>
          <MarkingThumbnailGrid nickname={nicknameParams} />
        </div>
      </section>
    </>
  );
};

const EmptyOtherProfileOverView = () => (
  <section className="w-full flex px-4 py-4 flex-col items-center gap-4 self-strech rounded-2xl border-grey-300 bg-grey-50">
    <img
      src="/default-image.png"
      className="w-16 h-16 rounded-[1.75rem]"
      alt="기본 마스코트 이미지"
    />
    <p className="text-grey-500 text-center body-2">
      아직 등록된 펫이 없습니다
    </p>
  </section>
);

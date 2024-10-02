import { ProfileNavigationBar } from "@/widgets/profile/ui";
import { ProfileOverView } from "@/widgets/profile/ui";
import { useGetProfile } from "@/features/profile/api";
import { TemporaryMarkingBar } from "@/entities/profile/ui";
import { GalleryGrid } from "@/entities/profile/ui/GalleryGrid";
import { useAuthStore } from "@/shared/store";

export const MyPage = () => {
  const role = useAuthStore((state) => state.role);
  const nickname = useAuthStore((state) => state.nickname);

  const { data, isLoading } = useGetProfile(nickname);

  // TODO 로딩 처리 하기
  if (isLoading) {
    return <div> 로딩즁 ..</div>;
  }

  const { pet, followers, followings, tempCnt, markings } = data!;

  return (
    <div>
      <ProfileNavigationBar role={role} nickname={nickname} />
      <section className="px-4 flex flex-col items-start gap-8">
        <ProfileOverView
          role={role}
          followers={followers}
          followings={followings}
          {...pet}
        />
        <div className="flex flex-col items-start gap-2 w-full ">
          <h3 className="text-grey-900 text-center title-2">내 마킹</h3>
          {tempCnt > 0 && (
            <TemporaryMarkingBar role={role} temporaryMarkingCount={tempCnt} />
          )}
          <GalleryGrid
            role={role}
            markings={markings}
            profileImage={pet?.profile ?? "/default-image.png"}
          />
        </div>
      </section>
    </div>
  );
};

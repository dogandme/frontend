import {
  EmptyMyProfileOverView,
  ProfileNavigationBar,
} from "@/widgets/profile/ui";
import { ProfileOverView } from "@/widgets/profile/ui";
import { useGetProfile, UserNickname } from "@/features/profile/api";
import { TemporaryMarkingBar } from "@/entities/profile/ui";
import {
  EmptyGalleryGrid,
  GalleryGrid,
} from "@/entities/profile/ui/GalleryGrid";
import { useAuthStore } from "@/shared/store";

export const MyPage = () => {
  const role = useAuthStore((state) => state.role);
  const nickname = useAuthStore((state) => state.nickname);
  const { data, isLoading } = useGetProfile(nickname);

  // TODO 로딩 처리 하기
  if (isLoading) {
    return <div> 로딩즁 ..</div>;
  }

  if (role !== "ROLE_USER") {
    return <NotUserMyPage role={role} nickname={nickname} />;
  }

  const { pet, followers, followings, tempCnt, markings } = data!;

  return (
    <div>
      <ProfileNavigationBar role={role} nickname={nickname} />
      <section className="px-4 flex flex-col items-start gap-8">
        <ProfileOverView
          followers={followers}
          followings={followings}
          {...pet}
        />
        <div className="flex flex-col items-start gap-2 w-full ">
          <h3 className="text-grey-900 text-center title-2">내 마킹</h3>
          {tempCnt > 0 && (
            <TemporaryMarkingBar temporaryMarkingCount={tempCnt} />
          )}
          <GalleryGrid markings={markings} profile={pet.profile} />
        </div>
      </section>
    </div>
  );
};

const NotUserMyPage = ({
  role,
  nickname,
}: {
  role: string | null;
  nickname: UserNickname | null;
}) => {
  return (
    <div>
      <ProfileNavigationBar role={role} nickname={nickname} />
      <section className="px-4 flex flex-col items-start gap-8">
        <EmptyMyProfileOverView role={role} />
        <div className="flex flex-col items-start gap-2 w-full ">
          <h3 className="text-grey-900 text-center title-2">내 마킹</h3>
          <EmptyGalleryGrid profile="/default-image.png" />
        </div>
      </section>
    </div>
  );
};

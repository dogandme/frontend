import {
  EmptyMyProfileOverView,
  ProfileNavigationBar,
} from "@/widgets/profile/ui";
import { ProfileOverView } from "@/widgets/profile/ui";
import type { ProfileOverViewProps } from "@/widgets/profile/ui";
import { useGetProfile, UserNickname } from "@/entities/profile/api";
import type { UserInfo } from "@/entities/profile/api";
import { TemporaryMarkingBar } from "@/entities/profile/ui";
import {
  EmptyGalleryGrid,
  GalleryGrid,
} from "@/entities/profile/ui/GalleryGrid";
import { useAuthStore } from "@/shared/store";
import type { AuthStore } from "@/shared/store";

export const MyPage = () => {
  const role = useAuthStore((state) => state.role);
  const nickname = useAuthStore((state) => state.nickname);
  const { data, isLoading } = useGetProfile(nickname);

  // TODO 로딩 처리 하기
  if (isLoading) {
    return <div> 로딩즁 ..</div>;
  }

  if (!data || !data.pet || !nickname) {
    return <RoleNotUserMyPage role={role} nickname={nickname} />;
  }

  return (
    <RoleUserMyPage {...data} role={role} nickname={nickname} pet={data.pet} />
  );
};

const RoleNotUserMyPage = ({
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

const RoleUserMyPage = ({
  role,
  nickname,
  followers,
  followings,
  pet,
  tempCnt,
  markings,
}: ProfileOverViewProps &
  Pick<AuthStore, "role"> &
  Pick<UserInfo, "tempCnt" | "markings">) => {
  return (
    <div>
      <ProfileNavigationBar role={role} nickname={nickname} />
      <section className="px-4 flex flex-col items-start gap-8">
        <ProfileOverView
          nickname={nickname}
          followers={followers}
          followings={followings}
          pet={pet}
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

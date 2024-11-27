import { Link } from "react-router-dom";
import { MarkingThumbnailGrid } from "@/widgets/marking/ui";
import {
  EmptyMyProfileOverView,
  MyProfileOverview,
} from "@/widgets/profile/ui";
import { TemporaryMarkingBar } from "@/entities/marking/ui";
import { useGetMyProfile } from "@/entities/profile/api";
import { ROUTER_PATH } from "@/shared/constants";
import { useNicknameParams } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { SettingIcon } from "@/shared/ui/icon";
import { NavigationBar } from "@/shared/ui/navigationBar";

export const MyProfilePage = () => {
  const { nicknameParams } = useNicknameParams();
  const { data } = useGetMyProfile();

  if (!data) {
    return <div>Loading...</div>;
  }

  const { followersIds, followingsIds, pet, tempCnt } = data;

  return (
    <>
      <MyPageNavigationBar />
      <section className="px-4 flex flex-col items-start gap-8">
        {pet ? (
          <MyProfileOverview
            nickname={nicknameParams}
            followersIds={followersIds}
            followingsIds={followingsIds}
            pet={pet}
          />
        ) : (
          <EmptyMyProfileOverView />
        )}
        <div className="flex flex-col items-start gap-2 w-full ">
          <h3 className="text-grey-900 text-center title-2">내 마킹</h3>
          {typeof tempCnt === "number" && tempCnt > 0 && (
            <TemporaryMarkingBar tempCnt={tempCnt} />
          )}
          <MarkingThumbnailGrid nickname={nicknameParams} />
        </div>
      </section>
    </>
  );
};

const MyPageNavigationBar = () => {
  const nickname = useAuthStore((state) => state.nickname);
  return (
    <NavigationBar>
      {`${nickname}님`}
      <Link
        to={ROUTER_PATH.SETTING}
        className="px-3 py-3 text-grey-500"
        aria-label="내 정보 설정하기"
      >
        <SettingIcon />
      </Link>
    </NavigationBar>
  );
};

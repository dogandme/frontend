import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { MarkingThumbnailGrid } from "@/widgets/marking/ui";
import {
  EmptyMyProfileOverView,
  MyProfileOverview,
} from "@/widgets/profile/ui";
import { TemporaryMarkingBar } from "@/entities/marking/ui";
import { useGetProfile } from "@/entities/profile/api";
import { ROUTER_PATH } from "@/shared/constants";
import { useNicknameParams } from "@/shared/lib/profile";
import { useAuthStore } from "@/shared/store";
import { SettingIcon } from "@/shared/ui/icon";
import { NavigationBar } from "@/shared/ui/navigationbar";
import { NotFoundUser } from "./notFoundUser";

export const MyProfilePage = () => {
  const { nicknameParams } = useNicknameParams();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  // TODO 404 와 같은 양식의 디자인 사용하는건 어떤지 디자이너와 상의
  const { data, isLoading, isError, error } = useGetProfile({
    nickname: nicknameParams,
  });

  useEffect(() => {
    if (!token) {
      navigate(ROUTER_PATH.LOGIN);
    }
  }, [token, navigate]);

  if (isError && error.code === 404) {
    return <NotFoundUser />;
  }

  if (!data || isLoading) {
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
    <NavigationBar
      componentType="buttonRight"
      label={<h1 className="text-grey-900 title-1">{nickname}님</h1>}
      button={
        <Link
          to={ROUTER_PATH.SETTING}
          className="px-3 py-3 text-grey-500"
          aria-label="내 정보 설정하기"
        >
          <SettingIcon />
        </Link>
      }
    />
  );
};

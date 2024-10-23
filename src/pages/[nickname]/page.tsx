import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProfileOverView } from "@/widgets/profile/ui";
import { TemporaryMarkingBar } from "@/entities/marking/ui";
import { useGetProfile } from "@/entities/profile/api";
import { ROUTER_PATH } from "@/shared/constants";
import { useNicknameParams } from "@/shared/lib/profile";
import { useAuthStore } from "@/shared/store";
import { SettingIcon } from "@/shared/ui/icon";
import { PlusIcon } from "@/shared/ui/icon";
import {
  BackwardNavigationBar,
  NavigationBar,
} from "@/shared/ui/navigationbar";
import { NotFoundUser } from "./notFoundUser";

/**
 * 해당 컴포넌트는 /:nickname 경로로 들어온 사용자의 프로필 페이지를 나타냅니다.
 * @:nickname: 해당 닉네임을 가진 사용자의 프로필 페이지, 만약 AuthStore에 저장된 닉네임과 같다면 마이페이지처럼 이용 가능 합니다.
 */
export const ProfilePage = () => {
  const { nicknameParams, isMyPage } = useNicknameParams();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const { data, isError, error } = useGetProfile({
    nickname: nicknameParams,
  });

  // TODO 404 와 같은 양식의 디자인 사용하는건 어떤지 디자이너와 상의
  useEffect(() => {
    if (!token) {
      navigate(ROUTER_PATH.LOGIN);
    }
  }, [token, navigate]);

  if (isError && error.code === 404) {
    return <NotFoundUser />;
  }

  if (!data) {
    return;
  }

  const { followersIds, followingsIds, pet, tempCnt } = data;

  const renderProfileOverView = () => {
    if (pet) {
      return (
        <ProfileOverView
          nickname={nicknameParams}
          followersIds={followersIds}
          followingsIds={followingsIds}
          pet={pet}
        />
      );
    }
    if (isMyPage) {
      return <EmptyMyProfileOverView />;
    }
    return <div>추가 예정인 컴포넌트</div>;
  };
  return (
    <>
      {isMyPage ? (
        <MyPageNavigationBar />
      ) : (
        <BackwardNavigationBar
          label={<h1 className="text-grey-900 title-1">{nicknameParams}님</h1>}
        />
      )}
      <section className="px-4 flex flex-col items-start gap-8">
        {/* TODO isMyPage에 따라 조건부 처리 하기*/}
        {renderProfileOverView()}
        <div className="flex flex-col items-start gap-2 w-full ">
          <h3 className="text-grey-900 text-center title-2">내 마킹</h3>
          {typeof tempCnt === "number" && tempCnt > 0 && (
            <TemporaryMarkingBar tempCnt={tempCnt} />
          )}
          {/* TODO 
          2024/10/23 마킹 썸네일 가져오는 로직이 변경 되었습니다. 
          해당 부분 수정 일어나야 합니다.
          마킹 API 결정 되면 그 때 수정이 일어나야 함 */}
          {/* <MarkingThumbnailGrid markings={markings} /> */}
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

/**
 * 해당 컴포넌트는 사용자가 반려동물을 등록하지 않았을 때 MyPage에서 나타나는 컴포넌트 입니다.
 */
export const EmptyMyProfileOverView = () => {
  return (
    <Link
      to={ROUTER_PATH.SIGN_UP_PET_INFO}
      className="px-4 py-4 flex flex-col gap-4 rounded-2xl border border-grey-300 bg-grey-50 w-full items-center text-grey-500"
    >
      <PlusIcon />
      <p className="title-3">반려동물을 등록해 주세요</p>
    </Link>
  );
};

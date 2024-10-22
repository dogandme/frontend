import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProfileOverView } from "@/widgets/profile/ui";
import {
  MarkingThumbnailGrid,
  TemporaryMarkingBar,
} from "@/entities/marking/ui";
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

/**
 * 해당 컴포넌트는 /:nickname 경로로 들어온 사용자의 프로필 페이지를 나타냅니다.
 * 이 때 @null, @none, @guest, @:nickname 으로 나누어 처리합니다.
 * @null , @none , @guest 는 직접 URL을 통해 접근 할 수 없으며 오로지 FooterNavigation 을 통해서만 접근 가능합니다.
 * @null: 사용자가 로그인하지 않은 상태에서 보이는 마이 페이지
 * @none: 사용자가 기본정보를 입력하지 않은 상태에서 보이는 마이 페이지
 * @guest: 사용자가 반려동물을 등록하지 않은 상태에서 보이는 마이 페이지
 * @:nickname: 해당 닉네임을 가진 사용자의 프로필 페이지, 만약 AuthStore에 저장된 닉네임과 같다면 마이페이지처럼 이용 가능 합니다.
 */
export const ProfilePage = () => {
  const { nicknameParams } = useNicknameParams();

  if (nicknameParams === "null") {
    return <NullPage />;
  }
  if (nicknameParams === "ROLE_NONE") {
    return <NonePage />;
  }
  if (nicknameParams === "ROLE_GUEST") {
    return <GuestPage />;
  }
  return <RoleUserProfile />;
};

const NullPage = () => {
  const navigate = useNavigate();
  const { isMyPage } = useNicknameParams();
  const nickname = useAuthStore((state) => state.nickname);
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    if (isMyPage) {
      return;
    }
    if (role === "ROLE_USER") {
      return navigate(`/@${nickname}`);
    }
    navigate(`/@${role}`);
  });

  if (!isMyPage) {
    return;
  }

  return (
    <>
      <NavigationBar
        componentType="buttonRight"
        label={
          <Link to={ROUTER_PATH.LOGIN} className="text-grey-900 title-1">
            로그인 후 이용해 주세요
          </Link>
        }
        button={
          <Link
            to={ROUTER_PATH.LOGIN}
            className="px-3 py-3 text-grey-500"
            aria-label="로그인 하기"
          >
            <SettingIcon />
          </Link>
        }
      />
      <section className="px-4 flex flex-col items-start gap-8">
        <EmptyMyProfileOverView />
        <div className="flex flex-col items-start gap-2 w-full ">
          <h3 className="text-grey-900 text-center title-2">내 마킹</h3>
          <MarkingThumbnailGrid markings={[]} />
        </div>
      </section>
    </>
  );
};

const NonePage = () => {
  const navigate = useNavigate();
  const { isMyPage } = useNicknameParams();
  const nickname = useAuthStore((state) => state.nickname);
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    if (isMyPage) {
      return;
    }
    if (role === "ROLE_USER") {
      return navigate(`/@${nickname}`);
    }
    navigate(`/@${role}`);
  });

  if (!isMyPage) {
    return;
  }

  return (
    <>
      <NavigationBar
        componentType="buttonRight"
        label={
          <Link
            to={ROUTER_PATH.SIGN_UP_USER_INFO}
            className="text-grey-900 title-1"
          >
            기본 정보 입력 후 이용해 주세요
          </Link>
        }
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
      <section className="px-4 flex flex-col items-start gap-8">
        <EmptyMyProfileOverView />
        <div className="flex flex-col items-start gap-2 w-full ">
          <h3 className="text-grey-900 text-center title-2">내 마킹</h3>
          <MarkingThumbnailGrid markings={[]} />
        </div>
      </section>
    </>
  );
};

const GuestPage = () => {
  const navigate = useNavigate();
  const { isMyPage } = useNicknameParams();
  const nickname = useAuthStore((state) => state.nickname);
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    if (isMyPage) {
      return;
    }
    if (role === "ROLE_USER") {
      return navigate(`/@${nickname}`);
    }
    navigate(`/@${role}`);
  });

  if (!isMyPage) {
    return;
  }

  return (
    <>
      <NavigationBar
        componentType="buttonRight"
        label={
          <Link
            to={ROUTER_PATH.SIGN_UP_PET_INFO}
            className="text-grey-900 title-1"
          >
            {nickname}
          </Link>
        }
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
      <section className="px-4 flex flex-col items-start gap-8">
        <EmptyMyProfileOverView />
        <div className="flex flex-col items-start gap-2 w-full ">
          <h3 className="text-grey-900 text-center title-2">내 마킹</h3>
          <MarkingThumbnailGrid markings={[]} />
        </div>
      </section>
    </>
  );
};

export const RoleUserProfile = () => {
  const { nicknameParams, isMyPage } = useNicknameParams();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const { data } = useGetProfile({
    nickname: nicknameParams,
    token,
  });

  useEffect(() => {
    if (!token) {
      navigate(ROUTER_PATH.LOGIN);
    }
  }, [token, navigate]);

  if (!data) {
    return;
  }

  const { followers, followings, pet, tempCnt, markings } = data;
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
        <ProfileOverView
          nickname={nicknameParams}
          followers={followers}
          followings={followings}
          pet={pet!}
        />
        <div className="flex flex-col items-start gap-2 w-full ">
          <h3 className="text-grey-900 text-center title-2">내 마킹</h3>
          {tempCnt > 0 && <TemporaryMarkingBar tempCnt={tempCnt} />}
          <MarkingThumbnailGrid markings={markings} />
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
 * 사용자 권한에 따라 라우팅 경로가 달라집니다.
 */
export const EmptyMyProfileOverView = () => {
  const role = useAuthStore((state) => state.role);

  const getNavigatePath = () => {
    if (role === null) {
      return ROUTER_PATH.LOGIN;
    }
    if (role === "ROLE_NONE") {
      return ROUTER_PATH.SIGN_UP_USER_INFO;
    }
    return ROUTER_PATH.SIGN_UP_PET_INFO;
  };

  return (
    <Link
      to={getNavigatePath()}
      className="px-4 py-4 flex flex-col gap-4 rounded-2xl border border-grey-300 bg-grey-50 w-full items-center text-grey-500"
    >
      <PlusIcon />
      <p className="title-3">반려동물을 등록해 주세요</p>
    </Link>
  );
};

import { Link } from "react-router-dom";
import { EmptyMyProfileOverView } from "@/widgets/profile/ui";
import { ProfileOverView } from "@/widgets/profile/ui";
import type { ProfileOverViewProps } from "@/widgets/profile/ui";
import { useGetProfile, UserNickname } from "@/entities/profile/api";
import type { UserInfo } from "@/entities/profile/api";
import { TemporaryMarkingBar } from "@/entities/profile/ui";
import {
  EmptyGalleryGrid,
  GalleryGrid,
} from "@/entities/profile/ui/GalleryGrid";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import type { AuthStore } from "@/shared/store";
import { SettingIcon } from "@/shared/ui/icon";
import { NavigationBar } from "@/shared/ui/navigationbar";

/**
 * 다음 조건의 경우엔 NotUSerMyPage 를 렌더링 합니다.
 * 1. role 이 null 일 경우 => ROLE_NULL
 * 2. nickname 이 null 일 경우 => ROLE_NONE
 * 3. data 가 존재하지 않는 경우 => ROLE_NONE
 * 4. data.pet 이 존재하지 않는 경우 => ROLE_GUEST
 *
 * 나머지 경우엔 UserMayPage 를 렌더링 합니다.
 */
export const MyPage = () => {
  const role = useAuthStore((state) => state.role);
  const nickname = useAuthStore((state) => state.nickname);
  const { data, isLoading } = useGetProfile(nickname);

  // TODO 로딩 처리 하기
  if (isLoading) {
    return <div> 로딩즁 ..</div>;
  }

  if (!role || !nickname || !data || !data.pet) {
    return <RoleNotUserMyPage role={role} nickname={nickname} />;
  }

  return (
    <RoleUserMyPage {...data} role={role} nickname={nickname} pet={data.pet} />
  );
};

/**
 * 이하 컴포넌트들은 MyPage 에서만 사용 되는 컴포넌트 입니다.
 * RoleNotUserMyPage 는 ROLE_NONE, ROLE_GUEST, ROLE_NULL 일 경우 렌더링 됩니다.
 * RoleUserMyPage 는 ROLE_USER 이상의 권한을 가진 사용자에게 렌더링 됩니다.
 * MyProfileNavigationBar 는 MyPage 에서만 사용되는 NavigationBar로 role , nickname 에 따라 다른 라우팅 경로와 UI 를 렌더링 합니다.
 */

const RoleNotUserMyPage = ({
  role,
  nickname,
}: {
  role: string | null;
  nickname: UserNickname | null;
}) => {
  return (
    <div>
      <MyPageNavigationBar role={role} nickname={nickname} />
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
      <MyPageNavigationBar role={role} nickname={nickname} />
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

type MyPageNavigationBarProps = Pick<AuthStore, "role" | "nickname">;
export const MyPageNavigationBar = ({
  role,
  nickname,
}: MyPageNavigationBarProps) => {
  if (role === null) {
    return (
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
    );
  }

  if (role === "ROLE_NONE") {
    return (
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
    );
  }

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

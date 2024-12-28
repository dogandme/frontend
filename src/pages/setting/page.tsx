import { Link } from "react-router-dom";
import { Report, LogoutButton } from "@/features/setting/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { withAuth } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { useSnackbar } from "@/shared/store/snackbar";
import { DividerLine } from "@/shared/ui/divider";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { BackwardNavigationBar } from "@/shared/ui/navigationBar";

const SettingPage = withAuth(() => {
  return (
    <>
      <section>
        <BackwardNavigationBar>설정</BackwardNavigationBar>
        <section className="flex flex-col gap-4 px-4 py-4">
          <AccountManagement />
          <EditMyInfo />
          <DividerLine axis="row" />
          <MyActivity />
          <Notification />
          <DividerLine axis="row" />
          <TermsOfService />
          <VersionInfo />
          <Report />
          <DividerLine axis="row" />
          <LogoutButton />
        </section>
      </section>
    </>
  );
}, ["ROLE_GUEST", "ROLE_USER"]);

export default SettingPage;

const AccountManagement = () => (
  <Link to={ROUTER_PATH.MANAGE_ACCOUNT} className="setting-item">
    <p>계정관리</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

const EditMyInfo = () => (
  <Link to={ROUTER_PATH.EDIT_MY_INFO} className="setting-item">
    <p>내 정보 수정</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

// 내 활동 내역을 보는 컴포넌트
const MyActivity = () => (
  <Link
    to={`/@${useAuthStore.getState().nickname}/${ROUTER_PATH.USER_MARKING}`}
    className="setting-item"
  >
    <p>내 활동</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

// 알림
const Notification = () => {
  const handleOpenSnackbar = useSnackbar("default");
  return (
    <button
      onClick={() => handleOpenSnackbar("아직 출시 되지 않은 기능입니다")}
      className="setting-item"
    >
      <p>알림</p>
      <span className="text-grey-500">
        <ArrowRightIcon />
      </span>
    </button>
  );
};

// 이용 약관
const TermsOfService = () => (
  <Link to="." className="setting-item">
    <p>이용 약관</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);
// 버전 정보
const VersionInfo = () => (
  <div className="setting-item">
    <p>버전 정보</p>
    <span className="text-grey-700 body-2">v0.1</span>
  </div>
);

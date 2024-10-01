import { Link } from "react-router-dom";
import { useSettingPermission } from "@/features/setting/hooks";
import { Report, LogoutButton } from "@/features/setting/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { DividerLine } from "@/shared/ui/divider";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const SettingPage = () => {
  const hasPermission = useSettingPermission("NONE");

  if (!hasPermission) {
    return null;
  }

  return (
    <>
      <section>
        <BackwardNavigationBar
          label={<h1 className="title-1 text-grey-900">설정</h1>}
        />
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
};

const AccountManagement = () => (
  <Link to={ROUTER_PATH.ACCOUNT} className="setting-item">
    <p>계정관리</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

const EditMyInfo = () => (
  <Link to="." className="setting-item">
    <p>내 정보 수정</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

// 내 활동 내역을 보는 컴포넌트
const MyActivity = () => (
  <Link to="." className="setting-item">
    <p>내 활동</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

// 알림
const Notification = () => (
  <Link to="." className="setting-item">
    <p>알림</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

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

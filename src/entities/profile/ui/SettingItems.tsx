import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@/shared/ui/icon";

const SettingClassName =
  "py-2 flex justify-between w-full text-grey-700 title-2";

// 계정 관리 하는 컴포넌트
export const AccountManagement = () => (
  <Link to="." className={SettingClassName}>
    <p>계정관리</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

export const EditMyInfo = () => (
  <Link to="." className={SettingClassName}>
    <p>내 정보 수정</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

// 내 활동 내역을 보는 컴포넌트
export const MyActivity = () => (
  <Link to="." className={SettingClassName}>
    <p>내 활동</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

// 알림
export const Notification = () => (
  <Link to="." className={SettingClassName}>
    <p>알림</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

// 이용 약관
export const TermsOfService = () => (
  <Link to="." className={SettingClassName}>
    <p>이용 약관</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

// 버전 정보
export const VersionInfo = () => (
  <div className={SettingClassName}>
    <p>버전 정보</p>
    <span className="text-grey-700 body-2">v0.1</span>
  </div>
);

// 문의/제안
export const Report = () => (
  <Link to="." className={SettingClassName}>
    <p>문의/제안</p>
    <span className="text-grey-700 body-2">mungwithme@gmail.com</span>
  </Link>
);

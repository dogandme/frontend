import { settingClassName } from "./setting.styles";

// 버전 정보
export const VersionInfo = () => (
  <div className={settingClassName}>
    <p>버전 정보</p>
    <span className="text-grey-700 body-2">v0.1</span>
  </div>
);

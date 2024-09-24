import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { settingClassName } from "./setting.styles";

// 계정 관리 하는 컴포넌트
export const AccountManagement = () => (
  <Link to="." className={settingClassName}>
    <p>계정관리</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

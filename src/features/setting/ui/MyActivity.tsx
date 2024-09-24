import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { settingClassName } from "../constants";

// 내 활동 내역을 보는 컴포넌트
export const MyActivity = () => (
  <Link to="." className={settingClassName}>
    <p>내 활동</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

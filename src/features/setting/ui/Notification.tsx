import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { settingClassName } from "./setting.styles";

// 알림
export const Notification = () => (
  <Link to="." className={settingClassName}>
    <p>알림</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

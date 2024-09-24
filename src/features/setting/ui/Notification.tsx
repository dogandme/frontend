import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { SettingClassName } from "../constants";

// 알림
export const Notification = () => (
  <Link to="." className={SettingClassName}>
    <p>알림</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

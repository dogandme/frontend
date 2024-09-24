import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { SettingClassName } from "../constants";

export const EditMyInfo = () => (
  <Link to="." className={SettingClassName}>
    <p>내 정보 수정</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

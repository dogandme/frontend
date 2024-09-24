import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { settingClassName } from "./setting.styles";

export const EditMyInfo = () => (
  <Link to="." className={settingClassName}>
    <p>내 정보 수정</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

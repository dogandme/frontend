import { Link } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { settingClassName } from "./setting.styles";

export const EditMyInfo = () => (
  <Link to={ROUTER_PATH.MODIFY_MY_INFO} className={settingClassName}>
    <p>내 정보 수정</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

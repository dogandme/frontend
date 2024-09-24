import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { settingClassName } from "../constants";

// 이용 약관
export const TermsOfService = () => (
  <Link to="." className={settingClassName}>
    <p>이용 약관</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

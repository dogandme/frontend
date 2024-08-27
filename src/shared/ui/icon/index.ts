import withIcon from "./Icon";

// svg 파일 Import
import EmailSvg from "@/shared/assets/email.svg";
import VisibilityOnSvg from "@/shared/assets/visibility-on.svg";
import VisibilityOffSvg from "@/shared/assets/visibility-off.svg";
import WardLeftSvg from "@/shared/assets/ward-left.svg";
import Checkbox from "@/shared/assets/check-box.svg";
import CheckboxOutline from "@/shared/assets/check-box-outline.svg";
import Indeterminate from "@/shared/assets/indeterminate.svg";
// Icon 컴포넌트 생성
export const EmailIcon = withIcon(EmailSvg);
export const VisibilityOnIcon = withIcon(VisibilityOnSvg);
export const VisibilityOffIcon = withIcon(VisibilityOffSvg);
export const WardLeftIcon = withIcon(WardLeftSvg);
export const CheckboxIcon = withIcon(Checkbox);
export const CheckboxOutlineIcon = withIcon(CheckboxOutline);
export const IndeterminateIcon = withIcon(Indeterminate);

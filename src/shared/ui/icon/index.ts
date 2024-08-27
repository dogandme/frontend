import withIcon from "./Icon";

// svg 파일 Import
import EmailSvg from "@/shared/assets/email.svg";
import VisibilityOnSvg from "@/shared/assets/visibility-on.svg";
import VisibilityOffSvg from "@/shared/assets/visibility-off.svg";
import WardLeftSvg from "@/shared/assets/ward-left.svg";
import CloseSvg from "@/shared/assets/close.svg";
import EditSvg from "@/shared/assets/edit.svg";
// Icon 컴포넌트 생성
export const EmailIcon = withIcon(EmailSvg);
export const VisibilityOnIcon = withIcon(VisibilityOnSvg);
export const VisibilityOffIcon = withIcon(VisibilityOffSvg);
export const WardLeftIcon = withIcon(WardLeftSvg);
export const CloseIcon = withIcon(CloseSvg);
export const EditIcon = withIcon(EditSvg);

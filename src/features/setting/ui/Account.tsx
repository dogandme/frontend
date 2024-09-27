import { useModal } from "@/shared/lib";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { useChangePasswordModal } from "../lib";
import { AccountCancellationModal } from "./_AccountCancellationModal";
import { settingClassName } from "./setting.styles";

export const PasswordChangeButton = () => {
  const handleOpenPasswordChangeModal = useChangePasswordModal();

  return (
    <button
      className={settingClassName}
      onClick={handleOpenPasswordChangeModal}
    >
      <p>비밀번호 변경</p>
      <span className="text-grey-500">
        <ArrowRightIcon />
      </span>
    </button>
  );
};

// TODO 계정 탈퇴 기능은 기획 완성 후 추가하기
export const AccountCancellationButton = () => {
  const { handleOpen, onClose } = useModal(() => (
    <AccountCancellationModal onClose={onClose} />
  ));

  return (
    <button className={settingClassName} onClick={handleOpen}>
      탈퇴하기
    </button>
  );
};

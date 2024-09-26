import { ArrowRightIcon } from "@/shared/ui/icon";
import { useCancellationCheckModal, useChangePasswordModal } from "../lib";
import { settingClassName } from "./setting.styles";

export const PasswordChangeButton = () => {
  const handleOpenPasswordChangeModal = useChangePasswordModal();

  return (
    <button
      className={settingClassName}
      onClick={handleOpenPasswordChangeModal}
    >
      <p>비밀번호 변경</p>
      <div className="flex">
        <span className="text-grey-700 body-2">●●●●●●●●</span>
        <span className="text-grey-500">
          <ArrowRightIcon />
        </span>
      </div>
    </button>
  );
};

// TODO 계정 탈퇴 기능은 기획 완성 후 추가하기
export const AccountCancellation = () => {
  const handleOpenCancellationCheckModal = useCancellationCheckModal();

  return (
    <button
      className={settingClassName}
      onClick={handleOpenCancellationCheckModal}
    >
      탈퇴하기
    </button>
  );
};

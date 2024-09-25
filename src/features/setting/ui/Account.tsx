import { useModal } from "@/shared/lib";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { PasswordChangeModal } from "./_PasswordChangeModal";
import { settingClassName } from "./setting.styles";

export const PasswordChangeButton = () => {
  const { handleOpen, onClose } = useModal(() => (
    <PasswordChangeModal onClose={onClose} />
  ));

  return (
    <button className={settingClassName} onClick={handleOpen}>
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
  return (
    <button className={settingClassName}>
      <p>탈퇴하기</p>
    </button>
  );
};

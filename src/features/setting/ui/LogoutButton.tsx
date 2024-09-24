import { useModal } from "@/shared/lib";
import { LogoutModal } from "./_LogoutModal";
import { settingClassName } from "./setting.styles";

export const LogoutButton = () => {
  const { handleOpen: handleOpenLogoutModal, onClose } = useModal(() => (
    <LogoutModal onCloseLogoutModal={onClose} />
  ));

  return (
    <button className={settingClassName} onClick={handleOpenLogoutModal}>
      로그아웃
    </button>
  );
};

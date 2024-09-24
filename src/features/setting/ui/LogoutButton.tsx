import { useModal } from "@/shared/lib";
import { LogoutModal } from "./_LogoutModal";

export const LogoutButton = () => {
  const { handleOpen: handleOpenLogoutModal, onClose } = useModal(() => (
    <LogoutModal onCloseLogoutModal={onClose} />
  ));

  return (
    <button
      className="py-2 flex justify-between w-full text-grey-700 title-2"
      onClick={handleOpenLogoutModal}
    >
      로그아웃
    </button>
  );
};

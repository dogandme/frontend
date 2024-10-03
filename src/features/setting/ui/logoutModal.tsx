import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { useSnackBar } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { CloseIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { Snackbar } from "@/shared/ui/snackbar";
import { usePostLogout } from "../api";

export const LogoutModal = ({
  onCloseLogoutModal,
}: {
  onCloseLogoutModal: () => Promise<void>;
}) => {
  const navigate = useNavigate();
  const { handleOpen: handleOpenSnackbar, onClose: onCloseSnackbar } =
    useSnackBar(() => (
      <Snackbar onClose={onCloseSnackbar}>로그아웃이 완료되었습니다</Snackbar>
    ));

  const { mutate: postLogout } = usePostLogout({
    onMutate: () => {
      onCloseLogoutModal();
      navigate(ROUTER_PATH.MAIN);
      handleOpenSnackbar();
    },
  });

  const handleLogout = () => {
    const { token } = useAuthStore.getState();
    postLogout(token);
  };

  return (
    <Modal modalType="center">
      <div className="flex justify-between">
        <h1 className="text-grey-900 title-1">로그아웃</h1>
        <button className="flex self-stretch" onClick={onCloseLogoutModal}>
          <CloseIcon />
        </button>
      </div>
      <p className="text-grey-700 body-2">정말로 로그아웃 하시겠어요?</p>
      <div className="flex gap-2">
        <button
          className="flex flex-1 justify-center items-center px-6 text-grey-500 btn-2"
          onClick={onCloseLogoutModal}
        >
          취소
        </button>
        <button
          className="flex flex-1 justify-center items-center  px-6 text-tangerine-500 btn-2"
          onClick={handleLogout}
        >
          확인
        </button>
      </div>
    </Modal>
  );
};

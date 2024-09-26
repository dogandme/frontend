import { useModal } from "@/shared/lib";
import { ExitConfirmModal } from "@/shared/ui/modal";
import { useAccountCancellationFormStore } from "../store";
import { usePasswordChangeFormStore } from "../store";
import { CancellationCheckModal } from "../ui/_CancellationCheckModal";
import { PasswordChangeModal } from "../ui/_PasswordChangeModal";

export const useCancellationCheckModal = () => {
  const resetCancellationForm = useAccountCancellationFormStore(
    (state) => state.reset,
  );

  let beforeCloseRecursiveFlag = true;

  const {
    handleOpen: handleOpenExitConfirmModal,
    onClose: onCloseConfirmModal,
  } = useModal(() => (
    <ExitConfirmModal
      onConfirm={() => {
        resetCancellationForm();
        onCloseConfirmModal();
        onCloseCancellationCheckModal();
      }}
      onClose={onCloseConfirmModal}
    />
  ));

  const {
    handleOpen: handleOpenCancellationCheckModal,
    onClose: onCloseCancellationCheckModal,
  } = useModal(
    () => <CancellationCheckModal onClose={onCloseCancellationCheckModal} />,
    {
      beforeClose: () => {
        if (!beforeCloseRecursiveFlag) {
          return;
        }
        beforeCloseRecursiveFlag = false;

        const { password } = useAccountCancellationFormStore.getState();
        if (password) {
          handleOpenExitConfirmModal();
          throw new Error(
            "입력 중인 패스워드가 존재하여 ConfirmModal을 열었습니다.",
          );
        }
        onCloseCancellationCheckModal();
      },
    },
  );
  return handleOpenCancellationCheckModal;
};

export const useChangePasswordModal = () => {
  const resetPasswordChangeForm = usePasswordChangeFormStore(
    (state) => state.reset,
  );

  let beforeCloseRecursiveFlag = true;

  const { handleOpen: handleOpenExitConfirmModal, onClose: onCloseExitModal } =
    useModal(() => (
      <ExitConfirmModal
        onClose={onCloseExitModal}
        onConfirm={() => {
          resetPasswordChangeForm();
          onCloseExitModal();
          onClosePasswordChangeModal();
        }}
      />
    ));

  const {
    handleOpen: handleOpenPasswordChangeModal,
    onClose: onClosePasswordChangeModal,
  } = useModal(
    () => <PasswordChangeModal onClose={onClosePasswordChangeModal} />,
    {
      beforeClose: () => {
        if (!beforeCloseRecursiveFlag) {
          return;
        }
        beforeCloseRecursiveFlag = false;

        const { currentPassword, newPassword, confirmPassword } =
          usePasswordChangeFormStore.getState();

        if (currentPassword || newPassword || confirmPassword) {
          handleOpenExitConfirmModal();
          throw new Error("입력 중인 폼이 존재하여 ConfirmModal을 열었습니다.");
        }
        onClosePasswordChangeModal();
      },
    },
  );

  return handleOpenPasswordChangeModal;
};

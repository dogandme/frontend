import { useModal } from "@/shared/lib";
import { Modal } from "@/shared/ui/modal";
import { usePasswordChangeFormStore } from "../store";
import { PasswordChangeModal } from "../ui";

export const usePasswordChangeModal = () => {
  const resetPasswordChangeForm = usePasswordChangeFormStore(
    (state) => state.reset,
  );

  const { handleOpen: handleOpenExitConfirmModal, onClose: onCloseExitModal } =
    useModal(() => (
      <Modal modalType="center">
        <Modal.Header onClick={onCloseExitModal}>
          화면을 나가시겠습니까?
        </Modal.Header>
        <Modal.Content className="text-grey-700 body-2">
          <p>화면을 나갈 경우 입력한 정보들이 모두 삭제 됩니다.</p>
          <p>정말 화면을 나가시겠습니까?</p>
        </Modal.Content>
        <Modal.Footer axis="row">
          <Modal.TextButton onClick={onCloseExitModal}>취소</Modal.TextButton>
          <Modal.FilledButton
            onClick={() => {
              resetPasswordChangeForm();
              onClosePasswordChangeModal();
            }}
          >
            나가기
          </Modal.FilledButton>
        </Modal.Footer>
      </Modal>
    ));

  const {
    handleOpen: handleOpenPasswordChangeModal,
    onClose: onClosePasswordChangeModal,
  } = useModal(
    () => <PasswordChangeModal onClose={onClosePasswordChangeModal} />,
    {
      beforeClose: () => {
        const { currentPassword, newPassword, confirmPassword } =
          usePasswordChangeFormStore.getState();

        if (currentPassword || newPassword || confirmPassword) {
          handleOpenExitConfirmModal();
          return true;
        }
      },
    },
  );

  return handleOpenPasswordChangeModal;
};

import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/shared/lib";
import { Modal } from "@/shared/ui/modal";
import { usePasswordCheckFormStore } from "../store";
import { PasswordCheckModal } from "../ui";

export const usePasswordCheckModal = () => {
  const resetAccountCancellationForm = usePasswordCheckFormStore(
    (state) => state.reset,
  );
  const queryClient = useQueryClient();

  const {
    handleOpen: handleOpenExitConfirmModal,
    onClose: onCloseConfirmModal,
  } = useModal(() => (
    <Modal modalType="center">
      <Modal.Header onClick={onCloseConfirmModal}>
        화면을 나가시겠습니까?
      </Modal.Header>
      <Modal.Content className="text-grey-700 body-2 gap-0">
        <p>화면을 나갈 경우 입력한 정보들이 모두 삭제 됩니다.</p>
        <p>정말 화면을 나가시겠습니까?</p>
      </Modal.Content>
      <Modal.Footer axis="row">
        <Modal.TextButton onClick={onCloseConfirmModal}>취소</Modal.TextButton>
        <Modal.FilledButton
          onClick={() => {
            resetAccountCancellationForm();
            onCloseCancellationCheckModal();
            onCloseConfirmModal();
          }}
        >
          나가기
        </Modal.FilledButton>
      </Modal.Footer>
    </Modal>
  ));

  const {
    handleOpen: handleOpenCancellationCheckModal,
    onClose: onCloseCancellationCheckModal,
  } = useModal(
    () => <PasswordCheckModal onClose={onCloseCancellationCheckModal} />,
    {
      beforeClose: () => {
        const mutation = queryClient.getMutationCache().find({
          mutationKey: ["deleteAccount"],
        });
        if (mutation?.state.status === "pending") {
          return true;
        }

        const { password } = usePasswordCheckFormStore.getState();
        if (password) {
          handleOpenExitConfirmModal();
          return true;
        }
      },
    },
  );
  return handleOpenCancellationCheckModal;
};

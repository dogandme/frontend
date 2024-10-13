import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/shared/lib";
import { Modal } from "@/shared/ui/modal";
import { usePasswordSetFormStore } from "../store";
import { PasswordSetModal } from "../ui";

export const usePasswordSetModal = () => {
  const resetPasswordSetForm = usePasswordSetFormStore((state) => state.reset);
  const queryClient = useQueryClient();

  const { handleOpen: handleOpenExitConfirmModal, onClose: onCloseExitModal } =
    useModal(() => (
      <Modal modalType="center">
        <Modal.Header onClick={onCloseExitModal}>
          화면을 나가시겠습니까?
        </Modal.Header>
        <Modal.Content>
          <div className="text-grey-700 body-2">
            <p>화면을 나갈 경우 입력한 정보들이 모두 삭제 됩니다.</p>
            <p>정말 화면을 나가시겠습니까?</p>
          </div>
        </Modal.Content>
        <Modal.Footer axis="row">
          <Modal.TextButton onClick={onCloseExitModal}>취소</Modal.TextButton>
          <Modal.FilledButton
            onClick={() => {
              resetPasswordSetForm();
              onClosePasswordSetModal();
              onCloseExitModal();
            }}
          >
            나가기
          </Modal.FilledButton>
        </Modal.Footer>
      </Modal>
    ));

  const {
    handleOpen: handleOpenPasswordSetModal,
    onClose: onClosePasswordSetModal,
  } = useModal(() => <PasswordSetModal onClose={onClosePasswordSetModal} />, {
    beforeClose: () => {
      /**
       * 만약 mutation 이 진행 중이라면 모달을 닫는 행위를
       * 중지 시킵니다.
       */
      const mutationCache = queryClient.getMutationCache().find({
        mutationKey: ["putSetPassword"],
      });
      if (mutationCache?.state.status === "pending") {
        return true;
      }

      const { newPassword, confirmPassword } =
        usePasswordSetFormStore.getState();

      if (newPassword || confirmPassword) {
        handleOpenExitConfirmModal();
        return true;
      }
    },
  });

  return handleOpenPasswordSetModal;
};

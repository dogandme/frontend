import { useModal } from "@/shared/lib";
import { ExitConfirmModal } from "@/shared/ui/modal";
import { useAccountCancellationFormStore } from "../store";
import { CancellationCheckModal } from "../ui/_CancellationCheckModal";

export const useCancellationCheckModal = () => {
  const resetCancellationForm = useAccountCancellationFormStore(
    (state) => state.reset,
  );

  // onCloseCancellationCheckModal에서 재귀적으로 beforeClose 를 호출하는 것을 방지하기 위한 flag
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

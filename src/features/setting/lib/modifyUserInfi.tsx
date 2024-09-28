import { useStore } from "zustand";
import { useModal } from "@/shared/lib";
import { ExitConfirmModal } from "@/shared/ui/modal";
import type { ModifyUserInfoFormStore } from "../store";
import { ChangeNickNameModal } from "../ui/_ChangeNickNameModal";

export const useChangeNickNameModal = (store: ModifyUserInfoFormStore) => {
  const _setNicknameInput = useStore(store, (state) => state._setNicknameInput);

  const {
    handleOpen: handleOpenExitConfirmModal,
    onClose: onCloseExitConfirmModal,
  } = useModal(() => (
    <ExitConfirmModal
      onClose={onCloseExitConfirmModal}
      onConfirm={() => {
        // 저장하지 않고 나갈 경우엔 ChangeNickNameModal 에서 사용하는 상태를 초기화
        _setNicknameInput(store.getState().nickname);
        onCloseExitConfirmModal();
        onClose();
      }}
    />
  ));

  const { handleOpen, onClose } = useModal(
    () => <ChangeNickNameModal store={store} onClose={onClose} />,
    {
      beforeClose: () => {
        const { _nicknameInput, nickname } = store.getState();
        if (_nicknameInput !== nickname) {
          handleOpenExitConfirmModal();
          return true;
        }
      },
    },
  );

  return handleOpen;
};

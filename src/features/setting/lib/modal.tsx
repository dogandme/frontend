import { useStore } from "zustand";
import { useModal } from "@/shared/lib";
import { ExitConfirmModal } from "@/shared/ui/modal";
import type { ModifyUserInfoFormStore } from "../store";
import { ChangeNickNameModal } from "../ui/_ChangeNickNameModal";

/**
 * 이 훅은 changeNickNameModal 을 ExitConfirmModal 과 함께 호출하는 훅입니다.
 * changeNickNameModal 에서 닉네임을 변경 한 후 저장을 누르면 외부에서 주입한 store 의 nickname 값을 모달에서 입력 된 값으로
 * 변경합니다.
 *
 * 만약 모달을 저장하지 않고 닫으면 store 의 값을 변경 되지 않고 모달 내부에서 사용하는 상태값이 store 에 저장된 값으로 초기화 됩니다.
 */
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
        if (_nicknameInput && _nicknameInput !== nickname) {
          handleOpenExitConfirmModal();
          return true;
        }
      },
    },
  );

  return handleOpen;
};

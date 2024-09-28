import { useStore } from "zustand";
import { Input } from "@/shared/ui/input";
import { FormModal } from "@/shared/ui/modal/FormModal";
import type { ModifyUserInfoFormStore } from "../store";

interface ChangeNickNameModalProps {
  onClose: () => Promise<void>;
  store: ModifyUserInfoFormStore;
}

const ChangeNickNameInput = ({
  store,
}: Pick<ChangeNickNameModalProps, "store">) => {
  const _nicknameInput = useStore(store, (state) => state._nicknameInput);
  const _setNicknameInput = useStore(store, (state) => state._setNicknameInput);

  return (
    <Input
      id="change-nickname"
      componentType="outlinedText"
      placeholder="닉네임을 입력해주세요"
      label="닉네임"
      trailingNode={
        <span className="text-grey-500">{_nicknameInput.length} / 20</span>
      }
      maxLength={20}
      essential
      onChange={(e) => _setNicknameInput(e.target.value)}
      value={_nicknameInput}
    />
  );
};

export const ChangeNickNameModal = ({
  onClose,
  store,
}: ChangeNickNameModalProps) => {
  const setNickname = useStore(store, (state) => state.setNickname);
  const handleConfirm = () => setNickname(store.getState()._nicknameInput);

  return (
    <FormModal onClose={onClose} onConfirm={handleConfirm} title="닉네임 변경">
      <ChangeNickNameInput store={store} />
    </FormModal>
  );
};

import { useStore } from "zustand";
import { usePostDuplicateNickname } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { StackedButtonModal } from "@/shared/ui/modal/StackedButtonModal";
import type { ModifyUserInfoFormStore } from "../store";

interface ChangeNicknameModalProps {
  onClose: () => Promise<void>;
  store: ModifyUserInfoFormStore;
}

const ChangeNicknameInput = ({
  store,
}: Pick<ChangeNicknameModalProps, "store">) => {
  const _nicknameInput = useStore(store, (state) => state._nicknameInput);
  const _setNicknameInput = useStore(store, (state) => state._setNicknameInput);
  const _setIsNicknameEmpty = useStore(
    store,
    (state) => state._setIsNicknameEmpty,
  );
  const _setIsNicknameValid = useStore(
    store,
    (state) => state._setIsNicknameValid,
  );

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const regExp = /^[a-zA-Z0-9ㄱ-ㅎ가-힣]{1,20}$/;

    _setNicknameInput(value);
    _setIsNicknameEmpty(value === "");
    _setIsNicknameValid(regExp.test(value));
  };

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
      onChange={handleChange}
      value={_nicknameInput}
    />
  );
};

const ChangeNicknameSave = ({ store, onClose }: ChangeNicknameModalProps) => {
  const setNickname = useStore(store, (state) => state.setNickname);
  const _isNicknameEmpty = useStore(store, (state) => state._isNicknameEmpty);
  const _isNicknameValid = useStore(store, (state) => state._isNicknameValid);

  const { mutate: postDuplicateNickname } = usePostDuplicateNickname();

  const handleSave = async () => {
    const { _nicknameInput, nickname } = store.getState();

    if (_nicknameInput === nickname) {
      onClose();
      return;
    }
    if (_isNicknameEmpty) {
      throw new Error("닉네임을 입력해 주세요");
    }
    if (!_isNicknameValid) {
      throw new Error("올바른 닉네임을 입력해 주세요");
    }

    postDuplicateNickname(
      { nickname: _nicknameInput },
      {
        onSuccess: () => {
          setNickname(_nicknameInput);
          onClose();
        },
        onError: (error) => {
          throw new Error(error.message);
        },
      },
    );
  };

  return (
    <Button
      variant="filled"
      colorType="primary"
      size="medium"
      onClick={handleSave}
    >
      저장
    </Button>
  );
};

export const ChangeNicknameModal = ({
  onClose,
  store,
}: ChangeNicknameModalProps) => {
  return (
    <StackedButtonModal
      onClose={onClose}
      title="닉네임 변경"
      ConfirmButton={<ChangeNicknameSave store={store} onClose={onClose} />}
    >
      <ChangeNicknameInput store={store} />
    </StackedButtonModal>
  );
};

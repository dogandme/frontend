import { useStore } from "zustand";
import { usePostDuplicateNickname } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { StackedButtonModal } from "@/shared/ui/modal/StackedButtonModal";
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
  const _setIsNickNameEmpty = useStore(
    store,
    (state) => state._setIsNickNameEmpty,
  );
  const _setIsNickNameValid = useStore(
    store,
    (state) => state._setIsNickNameValid,
  );

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const regExp = /^[a-zA-Z0-9ㄱ-ㅎ가-힣]{1,20}$/;

    _setNicknameInput(value);
    _setIsNickNameEmpty(value === "");
    _setIsNickNameValid(regExp.test(value));
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

const ChangeNickNameSave = ({ store, onClose }: ChangeNickNameModalProps) => {
  const setNickname = useStore(store, (state) => state.setNickname);
  const _isNickNameEmpty = useStore(store, (state) => state._isNickNameEmpty);
  const _isNickNameValid = useStore(store, (state) => state._isNickNameValid);

  const { mutate: postDuplicateNickname } = usePostDuplicateNickname();

  const handleSave = async () => {
    const { _nicknameInput, nickname } = store.getState();

    if (_nicknameInput === nickname) {
      onClose();
      return;
    }
    if (_isNickNameEmpty) {
      throw new Error("닉네임을 입력해 주세요");
    }
    if (!_isNickNameValid) {
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

const ChangeNickNameCancel = ({
  onClose,
}: Pick<ChangeNickNameModalProps, "onClose">) => (
  <Button
    colorType="tertiary"
    size="medium"
    variant="text"
    type="button"
    onClick={onClose}
  >
    취소
  </Button>
);

export const ChangeNickNameModal = ({
  onClose,
  store,
}: ChangeNickNameModalProps) => {
  return (
    <StackedButtonModal
      onClose={onClose}
      title="닉네임 변경"
      ConfirmButton={<ChangeNickNameSave store={store} onClose={onClose} />}
      CloseButton={<ChangeNickNameCancel onClose={onClose} />}
    >
      <ChangeNickNameInput store={store} />
    </StackedButtonModal>
  );
};

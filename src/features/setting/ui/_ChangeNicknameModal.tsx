import { useStore } from "zustand";
import { useQueryClient } from "@tanstack/react-query";
import { usePostDuplicateNickname } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { StackedButtonModal } from "@/shared/ui/modal";
import { Notice } from "@/shared/ui/notice";
import type { ModifyUserInfoFormStore } from "../store";

interface ChangeNicknameModalProps {
  onClose: () => Promise<void>;
  store: ModifyUserInfoFormStore;
}

const ChangeNicknameInput = ({
  store,
}: Pick<ChangeNicknameModalProps, "store">) => {
  const queryClient = useQueryClient();

  const _nicknameInput = useStore(store, (state) => state._nicknameInput);
  const _isNicknameEmpty = useStore(store, (state) => state._isNicknameEmpty);
  const _isNicknameValid = useStore(store, (state) => state._isNicknameValid);
  const _isNicknameDuplicated = useStore(
    store,
    (state) => state._isNicknameDuplicated,
  );

  const _setNicknameInput = useStore(store, (state) => state._setNicknameInput);
  const _setIsNicknameEmpty = useStore(
    store,
    (state) => state._setIsNicknameEmpty,
  );
  const _setIsNicknameValid = useStore(
    store,
    (state) => state._setIsNicknameValid,
  );
  const _setIsNicknameDuplicated = useStore(
    store,
    (state) => state._setIsNicknameDuplicated,
  );

  const duplicatedNicknames =
    queryClient.getQueryData<string[]>(["checkDuplicateNickname", "error"]) ||
    [];

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const regExp = /^[a-zA-Z0-9ㄱ-ㅎ가-힣]{1,20}$/;

    _setNicknameInput(value);
    _setIsNicknameEmpty(value === "");
    _setIsNicknameValid(regExp.test(value));

    /**
     * 닉네임 중복 검사 로직
     * 이전에 시행 했던 닉네임 중복 검사 결과 중 중복된 닉네임이 있는지 확인 합니다.
     */

    const { nickname } = store.getState();
    _setIsNicknameDuplicated(
      nickname === value || duplicatedNicknames.includes(value),
    );
  };

  const statusText = _isNicknameEmpty
    ? "20자 이내의 한글 영어 숫자만 사용 가능합니다"
    : _isNicknameDuplicated
      ? "이미 존재하는 닉네임 입니다"
      : !_isNicknameValid
        ? "20자 이내의 한글 영어 숫자만 사용 가능합니다"
        : "";

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
      statusText={statusText}
      isError={
        !_isNicknameEmpty && (!_isNicknameValid || _isNicknameDuplicated)
      }
    />
  );
};

const ChangeNicknameSaveButton = ({
  store,
  onClose,
}: ChangeNicknameModalProps) => {
  const setNickname = useStore(store, (state) => state.setNickname);
  const _setIsNicknameDuplicated = useStore(
    store,
    (state) => state._setIsNicknameDuplicated,
  );

  const queryClient = useQueryClient();

  const { mutate: postDuplicateNickname } = usePostDuplicateNickname();

  const handleSave = () => {
    const {
      _nicknameInput,
      _isNicknameEmpty,
      _isNicknameDuplicated,
      _isNicknameValid,
    } = store.getState();

    if (_isNicknameEmpty) {
      throw new Error("닉네임을 입력해 주세요");
    }
    if (!_isNicknameValid) {
      throw new Error("올바른 닉네임을 입력해 주세요");
    }

    if (_isNicknameDuplicated) {
      throw new Error("이미 사용중인 닉네임 입니다");
    }

    postDuplicateNickname(
      { nickname: _nicknameInput },
      {
        onSuccess: () => {
          setNickname(_nicknameInput);
          onClose();
        },
        onError: (error, variables) => {
          // 에러가 발생 할 시 queryClient 에 중복되었던 닉네임을 캐싱합니다.
          const mutationKey = ["checkDuplicateNickname", "error"];

          const existingNicknames =
            queryClient.getQueryData<string[]>(mutationKey) || [];

          queryClient.setQueryData(mutationKey, [
            ...existingNicknames,
            variables.nickname,
          ]);
          _setIsNicknameDuplicated(true);

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
      ConfirmButton={() => (
        <ChangeNicknameSaveButton store={store} onClose={onClose} />
      )}
    >
      <section className="flex flex-col gap-4">
        <Notice>
          <span>닉네임은 한 달 기준 1회 변경 할 수 있습니다</span>
        </Notice>
        <ChangeNicknameInput store={store} />
      </section>
    </StackedButtonModal>
  );
};

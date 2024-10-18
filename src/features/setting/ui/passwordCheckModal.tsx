import { useRef } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { PasswordInput } from "@/entities/auth/ui";
import { InfoIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { Notice } from "@/shared/ui/notice";
import { useDeleteAccount } from "../api/deleteAccount";
import {
  createPasswordCheckFormStore,
  PasswordCheckFormContext,
  usePasswordCheckFormContext,
  usePasswordCheckFormStore,
} from "../store";

const PasswordCheckFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const store = useRef(createPasswordCheckFormStore()).current;
  return (
    <PasswordCheckFormContext.Provider value={store}>
      {children}
    </PasswordCheckFormContext.Provider>
  );
};

const CurrentPasswordInput = () => {
  const isValidPassword = usePasswordCheckFormStore(
    (state) => state.isValidPassword,
  );
  const isEmptyCurrentPassword = usePasswordCheckFormStore(
    (state) => state.isEmptyPassword,
  );

  const setPassword = usePasswordCheckFormStore((state) => state.setPassword);

  const statusText = isEmptyCurrentPassword
    ? "비밀번호를 입력해 주세요"
    : isValidPassword
      ? ""
      : "비밀번호 형식에 맞게 입력해 주세요";

  return (
    <PasswordInput
      id="password"
      label="현재 비밀번호"
      statusText={statusText}
      isError={!isEmptyCurrentPassword && !isValidPassword}
      essential
      onChange={({ target }) => {
        setPassword(target.value);
      }}
    />
  );
};

const PasswordCheckSubmitButton = ({
  onClose,
}: {
  onClose: () => Promise<void>;
}) => {
  const store = usePasswordCheckFormContext();
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const handleSubmit = () => {
    const { password, isEmptyPassword, isValidPassword } = store.getState();

    if (isEmptyPassword) {
      // TODO 에러 바운더리 로직 나오면 수정 하기
      console.error("비밀번호를 입력해 주세요");
    }
    if (!isValidPassword) {
      return;
    }

    deleteAccount(
      { password },
      {
        onSuccess: onClose,
      },
    );
  };

  return (
    <Modal.FilledButton onClick={handleSubmit} disabled={isPending}>
      탈퇴하기
    </Modal.FilledButton>
  );
};

const PasswordCheckCloseButton = ({ onClose }: { onClose: () => void }) => {
  const isMutating =
    useIsMutating({
      mutationKey: ["deleteAccount"],
    }) > 0;

  return (
    <Modal.TextButton
      onClick={onClose}
      colorType="tertiary"
      disabled={isMutating}
    >
      취소
    </Modal.TextButton>
  );
};

export const PasswordCheckModal = ({
  onClose,
}: {
  onClose: () => Promise<void>;
}) => {
  return (
    // TODO FormModal 생성 되면 적용하기
    <PasswordCheckFormProvider>
      <Modal modalType="center">
        {/* 상단 네비게이션 바 */}
        <Modal.Header
          onClick={onClose}
          closeButtonAriaLabel="비밀번호 확인 모달 닫기"
        >
          비밀번호 확인
        </Modal.Header>
        <Modal.Content>
          {/* 알림창 */}
          <Notice>
            <InfoIcon width={20} height={20} />
            <span>탈퇴 전 한번 더 비밀번호를 입력해 주세요</span>
          </Notice>
          {/* PasswordInput */}
          <CurrentPasswordInput />
        </Modal.Content>
        {/* 버튼들 */}
        <Modal.Footer axis="col">
          <PasswordCheckSubmitButton onClose={onClose} />
          <PasswordCheckCloseButton onClose={onClose} />
        </Modal.Footer>
      </Modal>
    </PasswordCheckFormProvider>
  );
};

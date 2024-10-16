import { useEffect } from "react";
import { PasswordInput } from "@/entities/auth/ui";
import { InfoIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { Notice } from "@/shared/ui/notice";
import { useDeleteAccount } from "../api/deleteAccount";
import { usePasswordCheckFormStore } from "../store";

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

export const PasswordCheckModal = ({
  onClose,
}: {
  onClose: () => Promise<void>;
}) => {
  const resetAccountCancellationForm = usePasswordCheckFormStore(
    (state) => state.reset,
  );

  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const handleSubmit = () => {
    const { password, isEmptyPassword, isValidPassword } =
      usePasswordCheckFormStore.getState();

    if (isEmptyPassword) {
      // TODO 에러 바운더리 로직 나오면 수정 하기
      console.error("비밀번호를 입력해 주세요");
    }
    if (!isValidPassword) {
      return;
    }

    deleteAccount({ password });
  };
  useEffect(() => {
    return () => resetAccountCancellationForm();
  }, [resetAccountCancellationForm]);

  return (
    // TODO FormModal 생성 되면 적용하기
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
        <Modal.FilledButton onClick={handleSubmit} disabled={isPending}>
          탈퇴하기
        </Modal.FilledButton>
        <Modal.TextButton
          onClick={onClose}
          colorType="tertiary"
          disabled={isPending}
        >
          취소
        </Modal.TextButton>
      </Modal.Footer>
    </Modal>
  );
};

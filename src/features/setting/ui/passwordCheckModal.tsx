import { useEffect } from "react";
import { PasswordInput } from "@/entities/auth/ui";
import { InfoIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { Notice } from "@/shared/ui/notice";
import { usePasswordCheckFormStore } from "../store";

const validatePassword = (password: string) => {
  // 조건
  // 1. 영문, 숫자, 특수문자 3가지 조합 포함
  // 2. 8~15자 이내
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

  return passwordRegex.test(password);
};

const CurrentPasswordInput = () => {
  const isValidPassword = usePasswordCheckFormStore(
    (state) => state.isValidPassword,
  );
  const isEmptyCurrentPassword = usePasswordCheckFormStore(
    (state) => state.isEmptyPassword,
  );

  const setPassword = usePasswordCheckFormStore((state) => state.setPassword);
  const setIsValidPassword = usePasswordCheckFormStore(
    (state) => state.setIsValidPassword,
  );
  const setIsEmptyPassword = usePasswordCheckFormStore(
    (state) => state.setIsEmptyPassword,
  );
  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setPassword(value);

    const isValidPassword = validatePassword(value);
    const isPasswordEmpty = value.length === 0;

    setIsValidPassword(isValidPassword);
    setIsEmptyPassword(isPasswordEmpty);
  };

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
      onChange={handleChange}
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
        <Modal.FilledButton onClick={() => {}}>탈퇴하기</Modal.FilledButton>
        <Modal.TextButton onClick={onClose} colorType="tertiary">
          취소
        </Modal.TextButton>
      </Modal.Footer>
    </Modal>
  );
};

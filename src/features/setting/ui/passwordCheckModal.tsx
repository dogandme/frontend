import { useEffect } from "react";
import { PasswordInput } from "@/entities/auth/ui";
import { Button } from "@/shared/ui/button";
import { CloseIcon, InfoIcon } from "@/shared/ui/icon";
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
      <div className="flex self-stretch justify-between">
        <h1 className="text-grey-900 title-1">비밀번호 확인</h1>
        <button
          className="px-[0.3125rem]"
          onClick={onClose}
          aria-label="비밀번호 확인 모달 닫기"
        >
          <CloseIcon />
        </button>
      </div>
      <section className="flex flex-col gap-8">
        {/* 알림창 */}
        <Notice>
          <InfoIcon width={20} height={20} />
          <span>탈퇴 전 한번 더 비밀번호를 입력해 주세요</span>
        </Notice>
        {/* PasswordInput */}
        <CurrentPasswordInput />
      </section>
      {/* 버튼들 */}
      <div className="flex flex-col gap-2">
        <Button colorType="primary" variant="filled" size="medium">
          탈퇴하기
        </Button>
        <Button
          colorType="tertiary"
          variant="text"
          size="medium"
          onClick={onClose}
        >
          취소
        </Button>
      </div>
    </Modal>
  );
};

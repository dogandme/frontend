import { forwardRef, InputHTMLAttributes } from "react";
import { FieldError, useForm } from "react-hook-form";
import { PasswordInput } from "@/entities/auth/ui";
import { InfoIcon } from "@/shared/ui/icon";
import { InputWrapper, StatusText } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { Notice } from "@/shared/ui/notice";
import { useDeleteAccount } from "../api";

const CurrentPasswordInput = forwardRef<
  HTMLInputElement,
  { error?: FieldError } & InputHTMLAttributes<HTMLInputElement>
>(({ error, ...rest }, ref) => {
  return (
    <InputWrapper>
      <PasswordInput
        ref={ref}
        id="password"
        label="현재 비밀번호"
        isError={!!error}
        essential
        {...rest}
      />
      {error && <StatusText isError={!!error}>{error.message}</StatusText>}
    </InputWrapper>
  );
});

interface PasswordCheckModalProps {
  onClose: () => Promise<void>;
}

interface PasswordCheckFormType {
  password: string;
}

export const PasswordCheckModal = ({ onClose }: PasswordCheckModalProps) => {
  const { register, formState, handleSubmit } = useForm<PasswordCheckFormType>({
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  });
  const { errors, isValid } = formState;

  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const onSubmit = ({ password }: PasswordCheckFormType) => {
    if (!isValid) return;

    deleteAccount(
      { password },
      {
        onSuccess: onClose,
      },
    );
  };

  return (
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
        <CurrentPasswordInput
          error={errors.password}
          {...register("password", {
            required: "비밀번호를 입력해 주세요.",
            pattern: {
              value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,
              message: "비밀번호 형식에 맞게 입력해 주세요.",
            },
          })}
        />
      </Modal.Content>
      {/* 버튼들 */}
      <Modal.Footer axis="col">
        <Modal.FilledButton
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          탈퇴하기
        </Modal.FilledButton>
        <Modal.TextButton
          type="button"
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

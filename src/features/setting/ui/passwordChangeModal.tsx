import { forwardRef, InputHTMLAttributes, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { PasswordInput } from "@/entities/auth/ui";
import { useSnackbar } from "@/shared/store";
import { InputWrapper, StatusText } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { usePutChangePassword } from "../api";

const CurrentPasswordInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ onBlur, ...rest }, ref) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <InputWrapper>
      <PasswordInput
        ref={ref}
        id="current-password"
        label="현재 비밀번호"
        placeholder="현재 비밀번호를 입력해주세요"
        essential
        onFocus={() => setIsFocused(true)}
        {...rest}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
      />
      <StatusText>
        {isFocused ? "현재 비밀번호를 입력해주세요." : ""}
      </StatusText>
    </InputWrapper>
  );
});

const NewPasswordInput = forwardRef<
  HTMLInputElement,
  {
    error?: FieldError;
    isValid: boolean;
  } & InputHTMLAttributes<HTMLInputElement>
>(({ error, isValid, ...rest }, ref) => {
  let statusText = "";

  if (error && error.message) statusText = error.message;
  if (isValid) statusText = "사용가능한 비밀번호입니다.";

  return (
    <InputWrapper>
      <PasswordInput
        ref={ref}
        id="new-password"
        label="새 비밀번호"
        placeholder="비밀번호를 입력해 주세요"
        essential
        isError={!!error}
        {...rest}
      />
      <StatusText isError={!!error}>{statusText}</StatusText>
    </InputWrapper>
  );
});

const ConfirmNewPasswordInput = forwardRef<
  HTMLInputElement,
  {
    error?: FieldError;
    isValid: boolean;
  } & InputHTMLAttributes<HTMLInputElement>
>(({ error, isValid, ...rest }, ref) => {
  let statusText = "";

  console.log(error);

  if (error && error.message) statusText = error.message;
  if (isValid) statusText = "비밀번호가 일치합니다.";

  return (
    <InputWrapper>
      <PasswordInput
        ref={ref}
        id="confirm-new-password"
        placeholder="비밀번호를 다시 한 번 입력해주세요"
        essential
        isError={!!error}
        {...rest}
      />
      <StatusText isError={!!error}>{statusText}</StatusText>
    </InputWrapper>
  );
});

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const PasswordChangeModal = ({
  onClose,
}: {
  onClose: () => Promise<void>;
}) => {
  const { register, handleSubmit, formState } = useForm<ChangePasswordForm>({
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { errors, isValid, isDirty, dirtyFields } = formState;

  const { mutate: putChangePassword, isPending } = usePutChangePassword();
  const handleOpenSnackbar = useSnackbar("default");

  const onSubmit = ({
    currentPassword,
    newPassword,
    confirmPassword,
  }: ChangePasswordForm) => {
    if (isDirty) {
      handleOpenSnackbar("항목을 모두 입력해 주세요.");
      return;
    }

    if (errors.confirmPassword?.type === "isNotMatchedWithNewPassword") {
      handleOpenSnackbar("새 비밀번호를 다시 확인해 주세요.");
      return;
    }

    if (!isValid) {
      handleOpenSnackbar("비밀번호 형식에 맞게 입력해 주세요.");
      return;
    }

    putChangePassword({
      password: currentPassword,
      newPw: newPassword,
      newPwChk: confirmPassword,
    });
  };

  return (
    <Modal modalType="center">
      <Modal.Header
        onClick={onClose}
        closeButtonAriaLabel="비밀번호 변경 모달 닫기"
      >
        비밀번호 변경
      </Modal.Header>
      <Modal.Content>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CurrentPasswordInput
            {...register("currentPassword", {
              required: "비밀번호를 입력해 주세요.",
              pattern: {
                value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,15}$/,
                message: "비밀번호 형식에 맞게 입력해 주세요.",
              },
            })}
          />
          <div className="flex flex-col gap-1 mt-4">
            <NewPasswordInput
              isValid={!!dirtyFields.newPassword && !errors.newPassword}
              error={errors.newPassword}
              {...register("newPassword", {
                required: "비밀번호를 입력해 주세요.",
                pattern: {
                  value:
                    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,15}$/,
                  message: "비밀번호 형식에 맞게 입력해 주세요.",
                },
              })}
            />
            <ConfirmNewPasswordInput
              isValid={!!dirtyFields.confirmPassword && !errors.confirmPassword}
              error={errors.confirmPassword}
              {...register("confirmPassword", {
                required: "비밀번호를 다시 한번 입력해 주세요.",
                pattern: {
                  value:
                    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,15}$/,
                  message: "비밀번호 형식에 맞게 입력해 주세요.",
                },
                validate: {
                  isNotMatchedWithNewPassword: (value, formValues) =>
                    value === formValues.newPassword ||
                    "비밀번호가 서로 일치하지 않습니다.",
                },
              })}
            />
            <p className="body-3 px-3 pt-1 text-grey-500">
              영문, 숫자, 특수문자 3가지 조합을 포함하는 8자 이상 15자 이내로
              입력해 주세요.
            </p>
          </div>

          <div className="flex flex-col mt-8">
            <Modal.FilledButton disabled={isPending}>저장</Modal.FilledButton>
            <Modal.TextButton onClick={onClose} disabled={isPending}>
              취소
            </Modal.TextButton>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
};

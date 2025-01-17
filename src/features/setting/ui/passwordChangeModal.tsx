import { forwardRef, InputHTMLAttributes, useState } from "react";
import {
  type FieldError,
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { passwordRegex } from "@/features/auth/@x/setting";
import { PasswordInput } from "@/entities/auth/ui";
import { useSnackbar } from "@/shared/store";
import { InputWrapper, StatusText } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { usePutChangePassword } from "../api";
import {
  passwordChangeFormErrorMessage,
  passwordChangeFormValidationMessage,
} from "../constants";

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
        {isFocused ? passwordChangeFormErrorMessage.currentPassword : ""}
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
  if (isValid) statusText = passwordChangeFormValidationMessage.newPassword;

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

  if (error && error.message) statusText = error.message;
  if (isValid) statusText = passwordChangeFormValidationMessage.confirmPassword;

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

interface PasswordChangeFormType {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const PasswordChangeModal = ({
  onClose,
}: {
  onClose: () => Promise<void>;
}) => {
  const { register, handleSubmit, formState } = useForm<PasswordChangeFormType>(
    {
      mode: "onChange",
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    },
  );
  const { errors, dirtyFields } = formState;

  const { mutate: putChangePassword, isPending } = usePutChangePassword();
  const handleOpenSnackbar = useSnackbar("default");

  const onError: SubmitErrorHandler<PasswordChangeFormType> = (errors) => {
    if (
      errors.currentPassword?.type === "required" ||
      errors.newPassword?.type === "required" ||
      errors.confirmPassword?.type === "required"
    ) {
      handleOpenSnackbar(passwordChangeFormErrorMessage.submit.required);
      return;
    }

    if (errors.confirmPassword?.type === "isNotMatchedWithNewPassword") {
      handleOpenSnackbar(
        passwordChangeFormErrorMessage.confirmPassword.isNotMatchedWithPassword,
      );
      return;
    }

    handleOpenSnackbar(passwordChangeFormErrorMessage.submit.invalid);
  };

  const onSubmit: SubmitHandler<PasswordChangeFormType> = ({
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
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
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <CurrentPasswordInput
            {...register("currentPassword", {
              required: true,
            })}
          />
          <div className="flex flex-col gap-1 mt-4">
            <NewPasswordInput
              isValid={!!dirtyFields.newPassword && !errors.newPassword}
              error={errors.newPassword}
              {...register("newPassword", {
                required: passwordChangeFormErrorMessage.newPassword.required,
                pattern: {
                  value: passwordRegex,
                  message: passwordChangeFormErrorMessage.newPassword.pattern,
                },
              })}
            />
            <ConfirmNewPasswordInput
              isValid={!!dirtyFields.confirmPassword && !errors.confirmPassword}
              error={errors.confirmPassword}
              {...register("confirmPassword", {
                required:
                  passwordChangeFormErrorMessage.confirmPassword.required,
                pattern: {
                  value: passwordRegex,
                  message:
                    passwordChangeFormErrorMessage.confirmPassword.pattern,
                },
                validate: {
                  isNotMatchedWithNewPassword: (value, formValues) =>
                    value === formValues.newPassword ||
                    passwordChangeFormErrorMessage.confirmPassword
                      .isNotMatchedWithPassword,
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

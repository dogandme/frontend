import { forwardRef, InputHTMLAttributes } from "react";
import {
  type FieldError,
  type SubmitErrorHandler,
  useForm,
} from "react-hook-form";
import { passwordRegex } from "@/features/auth/@x/setting";
import { PasswordInput } from "@/entities/auth/ui";
import { useSnackbar } from "@/shared/store";
import { InputWrapper, StatusText } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { usePutSetPassword } from "../api";
import {
  passwordSetFormErrorMessage,
  passwordSetFormValidationMessage,
} from "../constants";

const NewPasswordInput = forwardRef<
  HTMLInputElement,
  {
    error?: FieldError;
    isValid: boolean;
  } & InputHTMLAttributes<HTMLInputElement>
>(({ error, isValid, ...rest }, ref) => {
  let statusText = "";

  if (error && error.message) statusText = error.message;
  if (isValid) statusText = passwordSetFormValidationMessage.newPassword;

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

const ConfirmPasswordInput = forwardRef<
  HTMLInputElement,
  {
    error?: FieldError;
    isValid: boolean;
  } & InputHTMLAttributes<HTMLInputElement>
>(({ error, isValid, ...rest }, ref) => {
  let statusText = "";

  if (error && error.message) statusText = error.message;
  if (isValid) statusText = passwordSetFormValidationMessage.confirmPassword;

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

interface PasswordSetModalProps {
  onClose: () => Promise<void>;
}

interface PasswordSetFormType {
  newPassword: string;
  confirmPassword: string;
}

export const PasswordSetModal = ({ onClose }: PasswordSetModalProps) => {
  const { formState, handleSubmit, register } = useForm<PasswordSetFormType>({
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { errors, dirtyFields } = formState;

  const { mutate: putSetPassword, isPending } = usePutSetPassword();

  const handleOpen = useSnackbar("default");

  const onError: SubmitErrorHandler<PasswordSetFormType> = (errors) => {
    if (
      errors.newPassword?.type === "required" ||
      errors.confirmPassword?.type === "required"
    ) {
      handleOpen(passwordSetFormErrorMessage.submit.required);
      return;
    }

    if (errors.confirmPassword?.type === "isNotMatchedWithNewPassword") {
      handleOpen(
        passwordSetFormErrorMessage.submit.isNotMatchedWithNewPassword,
      );
      return;
    }

    handleOpen(passwordSetFormErrorMessage.submit.invalid);
  };

  const onSubmit = ({ newPassword, confirmPassword }: PasswordSetFormType) => {
    putSetPassword(
      { newPw: newPassword, newPwChk: confirmPassword },
      {
        onSuccess: onClose,
      },
    );
  };

  return (
    <Modal modalType="center">
      <Modal.Header
        onClick={onClose}
        closeButtonAriaLabel="비밀번호 설정 모달 닫기"
      >
        비밀번호 설정
      </Modal.Header>
      <Modal.Content>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="flex flex-col gap-1">
            <NewPasswordInput
              isValid={!!dirtyFields.newPassword && !errors.newPassword}
              error={errors.newPassword}
              {...register("newPassword", {
                required: passwordSetFormErrorMessage.newPassword.required,
                pattern: {
                  value: passwordRegex,
                  message: passwordSetFormErrorMessage.newPassword.pattern,
                },
              })}
            />
            <ConfirmPasswordInput
              isValid={!!dirtyFields.confirmPassword && !errors.confirmPassword}
              {...register("confirmPassword", {
                required: passwordSetFormErrorMessage.confirmPassword.required,
                pattern: {
                  value: passwordRegex,
                  message: passwordSetFormErrorMessage.confirmPassword.pattern,
                },
                validate: {
                  isNotMatchedWithNewPassword: (value, formValues) =>
                    value === formValues.newPassword ||
                    passwordSetFormErrorMessage.confirmPassword
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
            <Modal.FilledButton type="submit" disabled={isPending}>
              저장
            </Modal.FilledButton>
            <Modal.TextButton
              type="button"
              onClick={onClose}
              disabled={isPending}
            >
              취소
            </Modal.TextButton>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
};

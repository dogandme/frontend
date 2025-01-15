import { forwardRef, InputHTMLAttributes } from "react";
import { FieldError, useForm } from "react-hook-form";
import { PasswordInput as _PasswordInput } from "@/entities/auth/ui";
import { useSnackbar } from "@/shared/store";
import { InputWrapper, StatusText } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { usePutSetPassword } from "../api";

const PasswordInput = forwardRef<
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
      <_PasswordInput
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
  if (isValid) statusText = "비밀번호가 일치합니다.";

  return (
    <InputWrapper>
      <_PasswordInput
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
  const { errors, dirtyFields, isValid } = formState;

  const { mutate: putSetPassword, isPending } = usePutSetPassword();

  const handleOpen = useSnackbar("default");

  const onSubmit = ({ newPassword, confirmPassword }: PasswordSetFormType) => {
    if (
      errors.newPassword?.type === "required" ||
      errors.confirmPassword?.type === "required"
    ) {
      handleOpen("항목을 모두 입력해 주세요.");
      return;
    }

    if (errors.confirmPassword?.type === "isNotMatchedWithNewPassword") {
      handleOpen("새 비밀번호를 다시 확인해 주세요.");
      return;
    }

    if (!isValid) {
      handleOpen("비밀번호 형식에 맞게 입력해 주세요.");
      return;
    }

    putSetPassword(
      { newPw: newPassword, newPwChk: confirmPassword },
      {
        onSuccess: () => {
          onClose();
        },
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <PasswordInput
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
            <ConfirmPasswordInput
              isValid={!!dirtyFields.confirmPassword && !errors.confirmPassword}
              {...register("confirmPassword", {
                required: "비밀번호를 입력해 주세요.",
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

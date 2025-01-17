import { forwardRef } from "react";
import {
  type FieldError,
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { PasswordInput } from "@/entities/auth/ui";
import { useSnackbar } from "@/shared/store";
import { Button } from "@/shared/ui/button";
import { Input, InputWrapper, StatusText } from "@/shared/ui/input";
import { usePostLogin } from "../api";
import { loginErrorMessage } from "../constants";
import { emailRegex } from "../lib";

interface LoginFormType {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const { handleSubmit, register, formState } = useForm<LoginFormType>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { errors } = formState;

  const { mutate: postLoginForm } = usePostLogin();
  const handleOpenSnackbar = useSnackbar("default");

  const onError: SubmitErrorHandler<LoginFormType> = (errors) => {
    if (
      errors.email?.type === "required" ||
      errors.password?.type === "required"
    ) {
      handleOpenSnackbar(loginErrorMessage.submit.required);
      return;
    }

    handleOpenSnackbar(loginErrorMessage.submit.invalid);
  };

  const onSubmit: SubmitHandler<LoginFormType> = (data) => {
    postLoginForm(data);
  };

  return (
    <form
      className="flex flex-col items-start gap-4 self-stretch"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <EmailInput
        error={errors.email}
        {...register("email", {
          required: loginErrorMessage.email.required,
          pattern: {
            value: emailRegex,
            message: loginErrorMessage.email.pattern,
          },
        })}
      />
      <PasswordInput
        id="password"
        label="비밀번호"
        {...register("password", {
          required: true,
        })}
      />

      <Button colorType="primary" size="large" variant="filled" type="submit">
        로그인
      </Button>
    </form>
  );
};

export const EmailInput = forwardRef<
  HTMLInputElement,
  { error?: FieldError } & React.InputHTMLAttributes<HTMLInputElement>
>(({ error, ...rest }, ref) => {
  const isError = !!error;

  return (
    <InputWrapper>
      <Input
        ref={ref}
        type="email"
        inputMode="email"
        placeholder="이메일을 입력해주세요"
        componentType="outlinedText"
        id="email"
        label="이메일"
        isError={isError}
        {...rest}
      />
      <StatusText isError={isError}>{isError ? error?.message : ""}</StatusText>
    </InputWrapper>
  );
});

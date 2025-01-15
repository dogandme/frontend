import { forwardRef } from "react";
import { FieldError, useForm } from "react-hook-form";
import { PasswordInput } from "@/entities/auth/ui";
import { useSnackbar } from "@/shared/store";
import { Button } from "@/shared/ui/button";
import { Input, InputWrapper, StatusText } from "@/shared/ui/input";
import { usePostLogin } from "../api";

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

  const { errors, isValid } = formState;

  const { mutate: postLoginForm } = usePostLogin();
  const handleOpenSnackbar = useSnackbar("default");

  const onSubmit = (data: LoginFormType) => {
    if (!isValid) {
      handleOpenSnackbar("아이디 또는 비밀번호를 모두 입력해 주세요");
      return;
    }

    postLoginForm(data);
  };

  return (
    <form
      className="flex flex-col items-start gap-4 self-stretch"
      onSubmit={handleSubmit(onSubmit)}
    >
      <EmailInput
        error={errors.email}
        {...register("email", {
          required: "이메일 형식으로 입력해 주세요.",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "올바른 이메일 형식으로 입력해 주세요.",
          },
        })}
      />
      <PasswordInput id="password" label="비밀번호" {...register("password")} />

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

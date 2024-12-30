import { useState } from "react";
import { PasswordInput } from "@/entities/auth/ui";
import { useSnackBarStore } from "@/shared/store";
import { Button } from "@/shared/ui/button";
import { Input, InputWrapper, StatusText } from "@/shared/ui/input";
import { usePostLogin } from "../api";
import { useLoginFormStore } from "../store";

interface FormProps {
  children: React.ReactNode;
}
export const Form = ({ children }: FormProps) => {
  return (
    <form className="flex flex-col items-start gap-4 self-stretch">
      {children}
    </form>
  );
};

/**
 * LoginForm.Email 컴포넌트는 이메일 입력값에 대한 에러 상태와 상태 메시지를 소모합니다.
 * 직접적으로 email 상태를 소모하지 않음으로서 에러 상태와 상태 메시지 변경 유무에 따라서만 리렌더링이 일어납니다.
 * 폼에서 email,  에러 상태 , 상태 메시지 상태를 변경 시킵니다.
 */
export const Email = () => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isValidEmail = useLoginFormStore((state) => state.isValidEmail);
  const statusText = useLoginFormStore((state) => state.statusText);

  const setEmail = useLoginFormStore((state) => state.setEmail);
  const setStatusText = useLoginFormStore((state) => state.setStatusText);
  const setIsValidEmail = useLoginFormStore((state) => state.setIsValidEmail);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: email } = e.currentTarget;
    const isValidEmail = new RegExp(
      "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    ).test(email);
    const isEmailEmpty = email.length === 0;
    const statusText = isEmailEmpty
      ? "이메일 형식으로 입력해 주세요"
      : isValidEmail
        ? ""
        : "올바른 이메일 형식으로 입력해 주세요";

    setEmail(email);
    setStatusText(statusText);
    setIsValidEmail(isEmailEmpty || isValidEmail);
  };

  const isError = !isValidEmail;

  return (
    <InputWrapper>
      <Input
        type="email"
        inputMode="email"
        placeholder="이메일을 입력해주세요"
        componentType="outlinedText"
        id="email"
        name="email"
        label="이메일"
        fullWidth
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        isError={isError}
      />
      <StatusText isError={isError}>
        {isFocused || isError ? statusText : ""}
      </StatusText>
    </InputWrapper>
  );
};

export const Password = () => {
  const setPassword = useLoginFormStore((state) => state.setPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: password } = e.currentTarget;
    setPassword(password);
  };

  return (
    <PasswordInput
      id="password"
      name="password"
      label="비밀번호"
      fullWidth
      onChange={handleChange}
    />
  );
};

export const SubmitButton = () => {
  const { mutate: postLoginForm } = usePostLogin();
  const setSnackbarProps = useSnackBarStore((state) => state.setSnackbarProps);

  const handleSubmit = () => {
    const { email, password, isValidEmail } = useLoginFormStore.getState();
    const isEmailEmpty = email.length === 0;
    const isPasswordEmpty = password.length === 0;

    if (isEmailEmpty || isPasswordEmpty || !isValidEmail) {
      setSnackbarProps("아이디 또는 비밀번호를 모두 입력해 주세요");
      return;
    }
    postLoginForm({ email, password });
  };

  return (
    <Button
      colorType="primary"
      size="large"
      variant="filled"
      role="submit"
      type="button"
      onClick={handleSubmit}
    >
      로그인
    </Button>
  );
};

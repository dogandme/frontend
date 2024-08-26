import { useState, useCallback } from "react";
import { useDebounce } from "@/shared/lib";

interface LoginForm {
  email: string;
  password: string;
  persistLogin: boolean;
}

export const useLoginForm = () => {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
    persistLogin: false,
  });

  /* 이메일 유효성  검사 */
  const checkEmailHasError = useCallback(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailHasError = !emailRegex.test(loginForm.email);
    const emailIsEmpty = loginForm.email.length === 0;

    return {
      emailHasError,
      emailIsEmpty,
      emailStatusText: emailHasError
        ? "올바른 이메일 형식으로 입력해 주세요"
        : "",
    };
  }, [loginForm.email]);

  const formValidationResult = useDebounce(checkEmailHasError, {
    emailHasError: false,
    emailIsEmpty: true,
    emailStatusText: "이메일 형식으로 입력해 주세요",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };

  const handlePersistLogin = () => {
    setLoginForm({
      ...loginForm,
      persistLogin: !loginForm.persistLogin,
    });
  };

  return {
    loginForm,
    handler: { handleChange, handlePersistLogin },
    formValidationResult,
  };
};
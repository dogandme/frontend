import { useState } from "react";
import { useDebounce } from "@/shared/lib";

export const useLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /* email 정규성 검사 코드 */
  const checkIsErrorEmail = () => {
    // 입력값이 존재하지 않는 경우
    if (email.length === 0) {
      return {
        isError: false,
        statusText: "이메일 형식으로 입력해 주세요",
      };
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isError = !emailRegex.test(email);
    // 이메일 형식에 맞지 않을 경우
    if (isError) {
      return {
        isError,
        statusText: "올바른 이메일 형식으로 입력해 주세요",
      };
    }
    // 이메일 형식이 맞을 경우
    return {
      isError: false,
      statusText: "",
    };
  };

  const { isError, statusText } = useDebounce(checkIsErrorEmail, {
    isError: false,
    statusText: "이메일 형식으로 입력해 주세요",
  });

  return {
    email,
    handleEmailChange,
    password,
    handlePasswordChange,
    emailHasError: isError,
    emailStatusText: statusText,
  };
};

import { useEffect, useState } from "react";

export const useLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorObject, setErrorObject] = useState<{
    isError: boolean;
    statusText: string;
  }>({ isError: false, statusText: "이메일 형식으로 입력해 주세요" });

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
    // 유효성 검증 정규식
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isError = !emailRegex.test(email);

    return {
      isError,
      statusText: isError ? "올바른 이메일 형식으로 입력해 주세요" : "",
    };
  };

  /* email 정규성 검 */
  useEffect(() => {
    setErrorObject(() => checkIsErrorEmail());
  }, [email]);

  return {
    email,
    handleEmailChange,
    password,
    handlePasswordChange,
    emailHasError: errorObject.isError,
    emailStatusText: errorObject.statusText,
  };
};

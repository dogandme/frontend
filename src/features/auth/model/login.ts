import { useEffect, useState, useCallback } from "react";

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
  const checkIsErrorEmail = useCallback(() => {
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

    // 에러 상태에 따라 errorObject를 다르게 반환합니다.
    return {
      isError,
      statusText: isError ? "올바른 이메일 형식으로 입력해 주세요" : "",
    };
  }, [email]);

  /* email 정규성 검사 */
  useEffect(() => {
    // 정규성 검사를 해야 하는 상태 값은 실제 DOM 업데이트 이후에 발생하기 때문에 useEffect를 사용합니다.
    setErrorObject(() => checkIsErrorEmail());
  }, [email, checkIsErrorEmail]);

  return {
    email,
    handleEmailChange,
    password,
    handlePasswordChange,
    emailHasError: errorObject.isError,
    emailStatusText: errorObject.statusText,
  };
};

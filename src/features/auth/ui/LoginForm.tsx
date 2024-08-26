import { useState } from "react";
import { EmailInput, PasswordInput } from "@/entities/auth/ui";
import { Button } from "@/shared/ui/button";
import { useLogin } from "../model";
import { useEmailForm } from "../api";

const LoginForm = () => {
  const {
    email,
    handleEmailChange,
    password,
    handlePasswordChange,
    emailHasError,
    emailStatusText,
  } = useLogin();
  const [persistLogin, setPersistLogin] = useState(false);

  const mutate = useEmailForm();

  return (
    <form
      className="flex flex-col items-start gap-4 self-stretch"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO : alert 창 모달로 변경하기
        if (emailHasError || password.length === 0) {
          alert("아이디 또는 비밀번호를 모두 입력해 주세요");
        }

        mutate.mutate({ email, password, persistLogin });
      }}
    >
      <EmailInput
        id="email"
        name="email"
        label="이메일"
        fullWidth
        value={email}
        onChange={handleEmailChange}
        isError={emailHasError}
        statusText={emailStatusText}
      />
      <PasswordInput
        id="password"
        name="password"
        label="비밀번호"
        fullWidth
        value={password}
        onChange={handlePasswordChange}
      />
      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          onClick={() => setPersistLogin(!persistLogin)}
        />
        <label htmlFor="rememberMe" className="btn-3 text-grey-700">
          로그인 유지
        </label>
      </div>
      <Button
        colorType="primary"
        size="large"
        variant="filled"
        role="submit"
        aria-label="login-submit-button"
        type="submit"
      >
        로그인
      </Button>
    </form>
  );
};

export default LoginForm;

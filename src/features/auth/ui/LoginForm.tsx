import { EmailInput, PasswordInput } from "@/entities/auth/ui";
import { Button } from "@/shared/ui/button";
import { useLogin } from "../model/login";

const LoginForm = () => {
  const {
    email,
    handleEmailChange,
    password,
    handlePasswordChange,
    emailHasError,
    emailStatusText,
  } = useLogin();

  return (
    <form
      className="flex flex-col items-start gap-4 self-stretch"
      onSubmit={(e) => {
        e.preventDefault();
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
        <input type="checkbox" id="rememberMe" name="rememberMe" />
        <label htmlFor="rememberMe" className="btn-3 text-grey-700">
          로그인 유지
        </label>
      </div>
      <Button colorType="primary" size="large" variant="filled">
        로그인
      </Button>
    </form>
  );
};

export default LoginForm;

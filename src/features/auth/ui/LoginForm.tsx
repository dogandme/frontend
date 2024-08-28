import { EmailInput, PasswordInput } from "@/entities/auth/ui";
import { Button } from "@/shared/ui/button";
import { useAuthStore } from "@/shared/store/auth";
import { useLoginForm } from "../model";
import { usePostLoginForm } from "../api";

const LoginForm = () => {
  const { loginForm, handler, formValidationResult } = useLoginForm();
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);
  const { mutate: postLoginForm } = usePostLoginForm();

  const { email, password, persistLogin } = loginForm;
  const { emailHasError, emailIsEmpty, emailStatusText } = formValidationResult;
  const { handleChange, handlePersistLogin } = handler;
  const passwordIsEmpty = password.length === 0;

  return (
    <form
      className="flex flex-col items-start gap-4 self-stretch"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO : alert 창 모달로 변경하기
        if (emailHasError || emailIsEmpty || passwordIsEmpty) {
          alert("아이디 또는 비밀번호를 모두 입력해 주세요");
          return;
        }
        postLoginForm(
          { email, password, persistLogin },
          {
            onSuccess: (data) => {
              const { token, role } = data.content;
              setToken(token);
              setRole(role);
              // TODO 리다이렉션하기
            },
            onError: (error) => {
              // TODO : alert 창 모달로 변경하기
              alert(error.message);
            },
          },
        );
      }}
    >
      <EmailInput
        id="email"
        name="email"
        label="이메일"
        fullWidth
        value={email}
        onChange={handleChange}
        isError={!emailIsEmpty && emailHasError}
        statusText={emailStatusText}
      />
      <PasswordInput
        id="password"
        name="password"
        label="비밀번호"
        fullWidth
        value={password}
        onChange={handleChange}
      />
      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          onClick={handlePersistLogin}
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
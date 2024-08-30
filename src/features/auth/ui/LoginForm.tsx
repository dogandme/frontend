import { EmailInput, PasswordInput } from "@/entities/auth/ui";
import { Button } from "@/shared/ui/button";
import { useLoginFormStore } from "../store";
import { usePostLoginForm } from "../api";
import { useAuthStore } from "@/shared/store/auth";
import { useRouteHistoryStore } from "@/shared/store/history";
import { useNavigate } from "react-router-dom";

export const Form = ({ children }: { children: React.ReactNode }) => {
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

  return (
    <EmailInput
      id="email"
      name="email"
      label="이메일"
      fullWidth
      onChange={handleChange}
      isError={!isValidEmail}
      statusText={statusText}
    />
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

export const PersistLogin = () => {
  const setPersistLogin = useLoginFormStore((state) => state.setPersistLogin);

  const handlePersistLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setPersistLogin(checked);
  };

  return (
    <div className="flex items-center gap-1">
      <input
        type="checkbox"
        id="rememberMe"
        name="rememberMe"
        onChange={handlePersistLogin}
      />
      <label htmlFor="rememberMe" className="btn-3 text-grey-700">
        로그인 유지
      </label>
    </div>
  );
};

export const SubmitButton = () => {
  const navigate = useNavigate();
  const { mutate: postLoginForm } = usePostLoginForm();
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);
  const setUserId = useAuthStore((state) => state.setUserId);
  const setNickname = useAuthStore((state) => state.setNickname);

  const handleSubmit = () => {
    const { email, password, isValidEmail, persistLogin } =
      useLoginFormStore.getState();
    const isEmailEmpty = email.length === 0;
    const isPasswordEmpty = password.length === 0;

    if (isEmailEmpty || isPasswordEmpty || !isValidEmail) {
      // TODO : alert 창 모달로 변경하기
      alert("아이디 또는 비밀번호를 모두 입력해 주세요");
      // TODO : 유효성을 만족하지 않는 경우의 메시지를 디자이너와 상담하여 생성하기
      return;
    }
    postLoginForm(
      { email, password, persistLogin },
      {
        onSuccess: (data) => {
          const { authorization, role, userId, nickname } = data.content;
          setToken(authorization);
          setRole(role);
          setUserId(userId);
          setNickname(nickname);

          const { lastNoneAuthRoute } = useRouteHistoryStore.getState();
          navigate(lastNoneAuthRoute);
        },
        onError: (error) => {
          if (error instanceof Error) {
            // TODO : alert 창 모달로 변경하기
            alert(error.message);
          }
          // 만약 alert 창이 아닌 콘솔 에러에서 에러 메시지가 표시되는 경우에는
          // 현재 우리가 컨트롤하고 있지 않은 에러 객체가 발생한 것입니다.
          // 에러를 보고 코드에 문제가 없는지 확인해봐야 합니다.
          console.error(error);
        },
      },
    );
  };

  return (
    <Button
      colorType="primary"
      size="large"
      variant="filled"
      role="submit"
      aria-label="login-submit-button"
      type="button"
      onClick={handleSubmit}
    >
      로그인
    </Button>
  );
};

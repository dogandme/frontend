import { IdInput, PasswordInput } from "@/entities/auth/ui";
import { Button } from "@/shared/ui/button";

const LoginForm = () => {
  return (
    <form className="flex flex-col items-start gap-4 self-stretch">
      <IdInput id="email" />
      <PasswordInput id="password" />
      <div className="flex items-center gap-1">
        <input type="checkbox" name="session-id" />
        <label htmlFor="session-id" className="btn-3 text-center text-grey-700">
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

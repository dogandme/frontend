import { Link } from "react-router-dom";
import { LoginForm } from "@/features/auth/ui";
import { ROUTER_PATH } from "@/shared/constants";

const EmailLoginPage = () => {
  return (
    <>
      <h1 className="headline-3 self-stretch text-ellipsis text-center text-grey-900">
        이메일로 로그인
      </h1>
      <LoginForm />
      <div className="flex flex-col items-center justify-center self-stretch">
        <p className="flex items-center justify-center self-stretch">
          <span className="title-3 text-center text-grey-500">
            아직 회원이 아니신가요?
          </span>
          <Link
            to={ROUTER_PATH.SIGN_UP}
            className="flex h-8 items-center justify-center gap-[10px] rounded-2xl"
          >
            <span className="btn-3 px-4 text-center text-tangerine-500">
              이메일 회원가입
            </span>
          </Link>
        </p>
        <p className="flex items-center justify-center self-stretch">
          <span className="title-3 text-center text-grey-500">
            비밀번호를 잊어버리셨나요?
          </span>
          <Link
            to={ROUTER_PATH.FORGET_PASSWORD}
            className="flex h-8 items-center justify-center gap-[10px] rounded-2xl"
          >
            <span className="btn-3 px-4 text-center text-tangerine-500">
              비밀번호 재설정
            </span>
          </Link>
        </p>
      </div>
    </>
  );
};

export default EmailLoginPage;

import { Link } from "react-router-dom";
import { BackwardNavigationBar } from "@/widgets/navigationbar/ui";
import { SignUpByEmailForm } from "@/features/auth/ui";
import { ROUTER_PATH } from "@/shared/constants";

const SignUpPage = () => {
  return (
    <div>
      <main className="flex flex-col gap-8 self-stretch px-4">
        <BackwardNavigationBar />
        <div></div>
        <h1 className="headline-3 mx-auto">이메일로 회원가입</h1>

        <SignUpByEmailForm />
      </main>

      <footer className="mt-8 flex items-center justify-center">
        <span className="title-3 text-grey-500">이미 회원이신가요?</span>
        <Link to={ROUTER_PATH.LOGIN} className="btn-3 ml-4 text-tangerine-500">
          로그인
        </Link>
      </footer>
    </div>
  );
};

export default SignUpPage;

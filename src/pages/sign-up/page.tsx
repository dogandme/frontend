import { Link } from "react-router-dom";
import { SignUpByEmailForm } from "@/features/auth/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { withAuth } from "@/shared/lib";

const SignUpPage = withAuth(() => {
  return (
    <div className="pb-32">
      <SignUpByEmailForm />

      <footer className="mt-8 flex items-center justify-center">
        <span className="title-3 text-grey-500">이미 회원이신가요?</span>
        <Link to={ROUTER_PATH.LOGIN} className="btn-3 ml-4 text-tangerine-500">
          로그인
        </Link>
      </footer>
    </div>
  );
}, [null]);

export default SignUpPage;

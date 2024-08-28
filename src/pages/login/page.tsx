import { Link } from "react-router-dom";
import { OAuthLoginHyperLinks, EmailLoginHyperLink } from "@/features/auth/ui";

const LoginPage = () => (
  <>
    <header className="flex flex-col items-center justify-center gap-2 self-stretch">
      <h1 className="headline-3 overflow-ellipsis text-center text-grey-900">
        로그인 및 회원가입
      </h1>
      <p className="body-2 flex flex-col self-stretch text-center text-grey-700">
        <span>반려동물과 함께한 특별한 장소를</span>
        <span>마킹하고 공유하세요</span>
      </p>
    </header>
    <div className="flex flex-col items-start gap-4 self-stretch">
      <OAuthLoginHyperLinks />
      <EmailLoginHyperLink />
    </div>
    <p className="flex items-center justify-center self-stretch">
      <span className="title-3 text-center text-grey-500">
        아직 회원이 아니신가요?
      </span>
      <Link
        to="/sign-up"
        className="flex h-8 items-center justify-center gap-[10px] rounded-2xl"
      >
        <span className="btn-3 px-4 text-center text-tangerine-500">
          이메일 회원가입
        </span>
      </Link>
    </p>
  </>
);

export default LoginPage;

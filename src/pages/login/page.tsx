import { Link } from "react-router-dom";
<<<<<<< HEAD
<<<<<<< HEAD
import { OAuthLoginHyperLinks, EmailLoginHyperLink } from "@/features/auth/ui";
=======
import {
  EmailLoginHyperLink,
  GoogleLoginHyperLink,
  NaverLoginHyperLink,
} from "@/entities/auth/ui/login";
>>>>>>> cc91675 (feat[#52] : /login 경로 페이지 생성)
=======
import { OAuthLoginHyperLinks, EmailLoginHyperLink } from "@/features/auth/ui";
>>>>>>> 07333ff (feat[#52] : /login 경로 로그인 페이지 생성)

const LoginPage = () => (
  <>
    <header className="flex flex-col items-center justify-center gap-2 self-stretch">
      <h1 className="headline-3 overflow-ellipsis text-center text-grey-900">
        로그인 및 회원가입
      </h1>
      <p className="body-2 flex flex-col self-stretch text-center text-grey-700">
        <span>반려동물과 함께한 특별한 장소를</span>
<<<<<<< HEAD
<<<<<<< HEAD
        <span>마킹하고 공유하세요</span>
      </p>
    </header>
    <div className="flex flex-col items-start gap-4 self-stretch">
      <OAuthLoginHyperLinks />
<<<<<<< HEAD
=======
        <span>마킹하고 공유하세요🐾</span>
=======
        <span>마킹하고 공유하세요</span>
>>>>>>> ff9d8aa (fix[#52] : 발바닥 이모지 제거)
      </p>
    </header>
    <div className="flex flex-col items-start gap-4 self-stretch">
      <NaverLoginHyperLink />
      <GoogleLoginHyperLink />
>>>>>>> cc91675 (feat[#52] : /login 경로 페이지 생성)
=======
>>>>>>> 07333ff (feat[#52] : /login 경로 로그인 페이지 생성)
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

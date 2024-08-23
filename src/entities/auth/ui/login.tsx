import { Link } from "react-router-dom";
import { NaverIcon, GoogleIcon } from "../assets";
import { EmailIcon } from "@/shared/ui/icon";

const hyperLinkColorMap = {
  naver: "bg-[#00BF18]",
  google: "bg-grey-0 border border-grey-900",
  email: "bg-grey-900",
};

const LoginHyperLinkClass =
  "flex h-12 items-center justify-center gap-[10px] self-stretch rounded-2xl pl-4 pr-6";

// TODO API 요청 로직 추가하기
export const NaverLoginHyperLink = () => (
  <button
    className={`${LoginHyperLinkClass} ${hyperLinkColorMap.naver} `}
    onClick={() => fetch("/oauth2/authorization/naver")}
  >
    <NaverIcon />
    <p className="button-2 text-center text-grey-0">Naver로 계속하기</p>
  </button>
);

export const GoogleLoginHyperLink = () => (
  <button
    className={`${LoginHyperLinkClass} ${hyperLinkColorMap.google}`}
    onClick={() => fetch("/oauth2/authorization/google")}
  >
    <GoogleIcon />
    <p className="button-2 text-center text-grey-900">Google로 계속하기</p>
  </button>
);

export const EmailLoginHyperLink = () => (
  <Link
    to="/login/email"
    className={`${LoginHyperLinkClass} ${hyperLinkColorMap.email}`}
  >
    <EmailIcon fill="#D9D9D9" />
    <p className="button-2 text-center text-grey-0">이메일로 계속하기</p>
  </Link>
);

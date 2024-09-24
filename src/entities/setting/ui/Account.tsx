import { settingClassName } from "./setting.styles";

export const AccountEmail = () => {
  // TODO API 요청이나 userInfo 에서 가져오기
  const emailFrom: "email" | "naver" | "google" = "email";
  const email = "gaeun1234@gmail.com";

  // 회원가입 시 사용 한 방법에 따라 결정되는 문구
  // 이메일 회원 가입 시엔 이메일,  구글이나 네이버를 이용한 OAuth 의 경우엔 해당 서비스명이 표시됨
  const emailFromText =
    emailFrom === "email"
      ? "이메일"
      : emailFrom === "naver"
        ? "네이버"
        : "구글";

  return (
    <div className={settingClassName}>
      <p>{emailFromText} 계정</p>
      <span className="text-grey-700 body-2">{email}</span>
    </div>
  );
};

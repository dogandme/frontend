import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePasswordChangeModal } from "@/features/setting/hooks";
import { AccountCancellationModal } from "@/features/setting/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { useModal } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { DividerLine } from "@/shared/ui/divider";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const AccountManagementPage = () => {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    if (!role) {
      navigate(ROUTER_PATH.MY_PAGE);
    }
  }, [navigate, role]);

  if (!role) {
    return null;
  }

  return (
    <>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-700">계정 관리</h1>}
      />
      <section className="flex flex-col gap-4 px-4 py-4">
        <AccountEmail />
        <PasswordChangeButton />
        <DividerLine axis="row" />
        <AccountCancellationButton />
      </section>
    </>
  );
};

const AccountEmail = () => {
  // TODO API 요청이나 userInfo 에서 가져오기
  const signUpMethod: "email" | "naver" | "google" = "email";
  const email = "gaeun1234@gmail.com";

  // 회원가입 시 사용 한 방법에 따라 결정되는 문구
  // 이메일 회원 가입 시엔 이메일,  구글이나 네이버를 이용한 OAuth 의 경우엔 해당 서비스명이 표시됨
  const emailFromText =
    signUpMethod === "email"
      ? "이메일"
      : signUpMethod === "naver"
        ? "네이버"
        : "구글";

  return (
    <div className="setting-item">
      <p>{emailFromText} 계정</p>
      <span className="text-grey-700 body-2">{email}</span>
    </div>
  );
};

const PasswordChangeButton = () => {
  const handleOpenPasswordChangeModal = usePasswordChangeModal();

  return (
    <button className="setting-item" onClick={handleOpenPasswordChangeModal}>
      <p>비밀번호 변경</p>
      <span className="text-grey-500">
        <ArrowRightIcon />
      </span>
    </button>
  );
};

const AccountCancellationButton = () => {
  const { handleOpen, onClose } = useModal(() => (
    <AccountCancellationModal onClose={onClose} />
  ));

  return (
    <button className="setting-item" onClick={handleOpen}>
      탈퇴하기
    </button>
  );
};

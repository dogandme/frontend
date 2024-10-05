import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpByEmailFormStore } from "@/features/auth/store";
import { SignUpByEmailForm } from "@/features/auth/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { useModal } from "@/shared/lib/overlay";
import { Button } from "@/shared/ui/button";
import { CloseIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

const SignUpPage = () => {
  const navigate = useNavigate();
  const resetSignUpByEmailFormStore = useSignUpByEmailFormStore(
    (state) => state.resetSignUpByEmailFormStore,
  );

  const { handleOpen, onClose } = useModal(() => {
    return (
      <Modal modalType="center" className="gap-8">
        <header className="flex justify-between">
          <h1 className="title-1 text-grey-900">정말 나가시겠나요?</h1>
          <button aria-label="모달 닫는 버튼" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>

        <p className="body-2 text-grey-700">
          페이지를 벗어나면 입력한 정보들을 모두 잃게 됩니다. 그래도
          나가실건가요?
        </p>

        <div className="flex gap-2">
          <Button
            variant="text"
            colorType="tertiary"
            size="medium"
            fullWidth={false}
            className="flex-1"
            onClick={() => {
              goOutsideCurrentPage();
            }}
          >
            나갈래요
          </Button>
          <Button
            variant="text"
            colorType="primary"
            size="medium"
            onClick={onClose}
            fullWidth={false}
            className="flex-1"
          >
            유지할게요
          </Button>
        </div>
      </Modal>
    );
  });

  const goOutsideCurrentPage = () => {
    navigate(ROUTER_PATH.LOGIN);
    onClose();
    resetSignUpByEmailFormStore();
  };

  const handleCloseButtonClick = () => {
    const { email, password, passwordConfirm } =
      useSignUpByEmailFormStore.getState();

    const isEmailEmpty = email.length === 0;
    const isPasswordEmpty = password.length === 0;
    const isPasswordConfirmEmpty = passwordConfirm.length === 0;

    const shouldOpenModal =
      !isEmailEmpty || !isPasswordEmpty || !isPasswordConfirmEmpty;

    if (!shouldOpenModal) {
      goOutsideCurrentPage();
      return;
    }

    handleOpen();
  };

  useEffect(() => {
    resetSignUpByEmailFormStore();
  }, [resetSignUpByEmailFormStore]);

  return (
    <div className="pb-32">
      <BackwardNavigationBar onClick={handleCloseButtonClick} />

      <main className="flex flex-col gap-8 self-stretch px-4 pt-8">
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

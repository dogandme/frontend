import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store/auth";
import { useRouteHistoryStore } from "@/shared/store/history";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import { CloseNavigationBar } from "@/shared/ui/navigationbar";

export const SignUpLandingModal = ({
  onClose,
}: {
  onClose: () => Promise<void>;
}) => {
  const { nickname } = useAuthStore.getState();

  const lastNoneAuthRoute = useRouteHistoryStore(
    (state) => state.lastNoneAuthRoute,
  );
  const navigate = useNavigate();

  const handleNavigate = async (path: string) => {
    await onClose();
    navigate(path);
  };

  return (
    <Modal modalType="fullPage">
      <CloseNavigationBar onClick={() => handleNavigate(lastNoneAuthRoute)} />
      <section className="flex flex-col px-4 py-8 pb-32 gap-8">
        <section className="flex px-4 flex-col justify-center items-center gap-2 self-stretch headline-3">
          <h1>
            <span className="text-tangerine-500">{nickname}</span>님
          </h1>
          <p>회원가입을 축하해요</p>
        </section>
        <div className="flex justify-center items-center">
          <img src="/public/default-image.png" alt="landing-image" />
        </div>
        <section className="body-1 text-grey-700 text-center">
          <p>반려동물을 등록하고</p>
          <p>더 많은 혜택을 받아보세요</p>
        </section>
        <section className="flex flex-col gap-4">
          <Button
            colorType="primary"
            variant="filled"
            size="large"
            className="btn-3"
            onClick={() => handleNavigate(ROUTER_PATH.SIGN_UP_PET_INFO)}
          >
            등록하기
          </Button>
          <Button
            colorType="tertiary"
            variant="text"
            size="large"
            className="btn-3"
            onClick={() => handleNavigate(lastNoneAuthRoute)}
          >
            나중에 할게요
          </Button>
        </section>
      </section>
    </Modal>
  );
};

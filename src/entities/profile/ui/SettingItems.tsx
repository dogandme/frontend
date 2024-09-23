import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSnackBar } from "@/shared/lib";
import { useModal } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { CloseIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { Snackbar } from "@/shared/ui/snackbar";

const SettingClassName =
  "py-2 flex justify-between w-full text-grey-700 title-2 hover:bg-grey-50 focus-visible:bg-grey-50 focus-visible:outline-none active:bg-grey-100";

// 계정 관리 하는 컴포넌트
export const AccountManagement = () => (
  <Link to="." className={SettingClassName}>
    <p>계정관리</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

export const EditMyInfo = () => (
  <Link to="." className={SettingClassName}>
    <p>내 정보 수정</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

// 내 활동 내역을 보는 컴포넌트
export const MyActivity = () => (
  <Link to="." className={SettingClassName}>
    <p>내 활동</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

// 알림
export const Notification = () => (
  <Link to="." className={SettingClassName}>
    <p>알림</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

// 이용 약관
export const TermsOfService = () => (
  <Link to="." className={SettingClassName}>
    <p>이용 약관</p>
    <span className="text-grey-500">
      <ArrowRightIcon />
    </span>
  </Link>
);

// 버전 정보
export const VersionInfo = () => (
  <div className={SettingClassName}>
    <p>버전 정보</p>
    <span className="text-grey-700 body-2">v0.1</span>
  </div>
);

// 문의/제안
export const Report = () => {
  const officialEmail = "mungwithme@gmail.com";

  const { handleOpen, onClose } = useSnackBar(() => (
    <Snackbar onClose={onClose}>
      <p>문의 사항을 보낼 이메일 주소가 복사되었습니다</p>
    </Snackbar>
  ));

  const handleClick = async () => {
    try {
      await window.navigator.clipboard.writeText(officialEmail);
      handleOpen();
    } catch (error) {
      // TODO 에러 처리 로직 추가
      console.error(error);
      throw new Error("이메일 주소를 복사 하던 중 오류가 발생했습니다");
    }
  };
  return (
    <button onClick={handleClick} className={SettingClassName}>
      <p>문의/제안</p>
      <span className="text-grey-700 body-2">mungwithme@gmail.com</span>
    </button>
  );
};

// TODO confirm modal 이용해서 생성하기
const LogoutModal = ({
  onCloseLogoutModal,
}: {
  onCloseLogoutModal: () => Promise<void>;
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    useAuthStore.setState({
      token: "",
      role: null,
      nickname: null,
    });
    onCloseLogoutModal();
    navigate("/");
  };

  return (
    <Modal modalType="center">
      <div className="flex justify-between">
        <h1 className="text-grey-900 title-1">로그아웃</h1>
        <button className="flex self-stretch" onClick={onCloseLogoutModal}>
          <CloseIcon />
        </button>
      </div>
      <p className="text-grey-700 body-2">정말로 로그아웃 하시겠어요?</p>
      <div className="flex gap-2">
        <button
          className="flex flex-1 justify-center items-center px-6 text-grey-500 btn-2"
          onClick={onCloseLogoutModal}
        >
          취소
        </button>
        <button
          className="flex flex-1 justify-center items-center  px-6 text-tangerine-500 btn-2"
          onClick={handleLogout}
        >
          확인
        </button>
      </div>
    </Modal>
  );
};

export const LogoutButton = () => {
  const { handleOpen: handleOpenLogoutModal, onClose } = useModal(() => (
    <LogoutModal onCloseLogoutModal={onClose} />
  ));

  return (
    <button
      className="py-2 flex justify-between w-full text-grey-700 title-2"
      onClick={handleOpenLogoutModal}
    >
      로그아웃
    </button>
  );
};

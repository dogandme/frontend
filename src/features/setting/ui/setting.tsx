/**
 * 해당 파일은 /my-page/setting 에서 사용 되는 컴포넌트를 모아둔 파일입니다.
 * page 레이어에서 정의 되기엔 비즈니스 로직이나 도메인 로직이 존재하는 컴포넌트 들을 모아뒀습니다.
 */
import { useSnackBar } from "@/shared/lib";
import { useModal } from "@/shared/lib";
import { LogoutModal } from "./logoutModal";

export const Report = () => {
  const officialEmail = "mungwithme@gmail.com";

  const handleOpenSnackbar = useSnackBar();

  const handleClick = async () => {
    try {
      await window.navigator.clipboard.writeText(officialEmail);
      handleOpenSnackbar("문의 사항을 보낼 이메일 주소가 복사되었습니다");
    } catch (error) {
      // TODO 에러 처리 로직 추가
      console.error(error);
      throw new Error("이메일 주소를 복사 하던 중 오류가 발생했습니다");
    }
  };
  return (
    <button onClick={handleClick} className="setting-item">
      <p>문의/제안</p>
      <span className="text-grey-700 body-2">mungwithme@gmail.com</span>
    </button>
  );
};

export const LogoutButton = () => {
  const { handleOpen: handleOpenLogoutModal, onClose } = useModal(() => (
    <LogoutModal onCloseLogoutModal={onClose} />
  ));

  return (
    <button className="setting-item" onClick={handleOpenLogoutModal}>
      로그아웃
    </button>
  );
};

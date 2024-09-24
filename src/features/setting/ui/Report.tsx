import { useSnackBar } from "@/shared/lib";
import { Snackbar } from "@/shared/ui/snackbar";
import { settingClassName } from "../constants";

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
    <button onClick={handleClick} className={settingClassName}>
      <p>문의/제안</p>
      <span className="text-grey-700 body-2">mungwithme@gmail.com</span>
    </button>
  );
};

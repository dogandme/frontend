import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 justify-center items-center mx-auto my-0 h-screen max-w-[37.5rem]">
      <img src="/default-image.png" alt="logo" width="64" height="64" />

      <h1 className="title-1 text-grey-700">404 ERROR</h1>

      <div className="flex flex-col items-center body-2 text-grey-500">
        <span>존재하지 않은 주소를 입력하셨거나,</span>
        <span>요청하신 페이지 주소가 변경, 삭제되어 찾을 수 없습니다.</span>
      </div>

      <Button
        variant="filled"
        colorType="secondary"
        size="xSmall"
        fullWidth={false}
        onClick={() => {
          navigate(-1);
        }}
      >
        이전으로
      </Button>
    </div>
  );
};

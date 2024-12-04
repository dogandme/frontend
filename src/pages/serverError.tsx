import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";

export const ServerError = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 justify-center items-center mx-auto my-0 h-screen max-w-[37.5rem]">
      <img src="/default-image.png" alt="logo" width="64" height="64" />

      <h1 className="title-1 text-grey-700">SYSTEM ERROR</h1>

      <div className="flex flex-col items-center body-2 text-grey-500">
        <span>서비스 이용에 불편을 드려 죄송합니다.</span>
        <span>잠시 후 다시 확인해주세요.</span>
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

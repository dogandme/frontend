import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { Button } from "@/shared/ui/button";

export const NonAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 justify-center items-center mx-auto my-0 h-screen max-w-[37.5rem]">
      <img src="/default-image.png" alt="logo" width="64" height="64" />

      <h1 className="title-1 text-grey-700">접근할 수 없습니다.</h1>

      <div className="flex flex-col items-center body-2 text-grey-500">
        <span>권한이 없거나, 사용할 수 없는 페이지입니다.</span>
        <span>로그인 정보를 다시 한 번 확인해주세요.</span>
      </div>

      <Button
        variant="filled"
        colorType="secondary"
        size="xSmall"
        fullWidth={false}
        onClick={() => {
          navigate(ROUTER_PATH.MAIN);
        }}
      >
        메인으로 이동
      </Button>
    </div>
  );
};

export const NonLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 justify-center items-center mx-auto my-0 h-screen max-w-[37.5rem]">
      <img src="/default-image.png" alt="logo" width="64" height="64" />

      <h1 className="title-1 text-grey-700">로그인 해주세요.</h1>

      <div className="flex flex-col items-center body-2 text-grey-500">
        <span>권한이 없거나, 사용할 수 없는 페이지입니다.</span>
        <span>로그인이 필요한 서비스입니다.</span>
      </div>

      <Button
        variant="filled"
        colorType="secondary"
        size="xSmall"
        fullWidth={false}
        onClick={() => {
          navigate(ROUTER_PATH.LOGIN);
        }}
      >
        로그인 하러가기
      </Button>
    </div>
  );
};

export const NonUserInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 justify-center items-center mx-auto my-0 h-screen max-w-[37.5rem]">
      <img src="/default-image.png" alt="logo" width="64" height="64" />

      <h1 className="title-1 text-grey-700">기본 정보를 등록해주세요.</h1>

      <div className="flex flex-col items-center body-2 text-grey-500">
        <span>권한이 없거나, 사용할 수 없는 페이지입니다.</span>
        <span>기본 정보를 등록했는지 확인해주세요.</span>
      </div>

      <Button
        variant="filled"
        colorType="secondary"
        size="xSmall"
        fullWidth={false}
        onClick={() => {
          navigate(ROUTER_PATH.SIGN_UP_USER_INFO);
        }}
      >
        기본 정보 입력하기
      </Button>
    </div>
  );
};

export const NonPetInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 justify-center items-center mx-auto my-0 h-screen max-w-[37.5rem]">
      <img src="/default-image.png" alt="logo" width="64" height="64" />

      <h1 className="title-1 text-grey-700">펫 정보를 등록해주세요.</h1>

      <div className="flex flex-col items-center body-2 text-grey-500">
        <span>권한이 없거나, 사용할 수 없는 페이지입니다.</span>
        <span>펫 정보를 등록했는지 확인해주세요.</span>
      </div>

      <Button
        variant="filled"
        colorType="secondary"
        size="xSmall"
        fullWidth={false}
        onClick={() => {
          navigate(ROUTER_PATH.SIGN_UP_PET_INFO);
        }}
      >
        펫 정보 등록하기
      </Button>
    </div>
  );
};

import { useState, useEffect } from "react";
import { type Role, useAuthStore } from "@/shared/store";
import { Button } from "@/shared/ui/button";

// ! TODO
// ! 해당 컴포넌트는 개발 환경에서만 사용 되는 컴포넌트 입니다.
// ! main.ts 파일에서 렌더링 되며 import.meta.DEV 를 통해 개발 환경인지 확인합니다.
// ! 배포 시엔 해당 컴포넌트가 렌더링 되지 않지만 위험을 방지하기 위해 배포 시 해당 컴포넌트를 제거 해주세요
export const DevTools = () => {
  // 미디어 쿼리를 통해 max-width 가 1100px 이상일 경우에만 렌더링 되도록 합니다.
  // matchMedia(검사 할 문자열) 을 통해 미디어 쿼리를 검사하고 반환되는 이벤트의 matches 결과를 통해
  // 해당 미디어 쿼리가 맞는지 확인합니다.
  const [isWideEnough, setIsWideEnough] = useState(
    window.matchMedia("(min-width: 1000px)").matches,
  );

  const nickname = "뽀송송";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1000px)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIsWideEnough(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  if (!isWideEnough) {
    return null;
  }

  const setRefreshToken = ({
    role,
    isValid,
  }: {
    role: NonNullable<Role>;
    isValid: boolean;
  }) => {
    const refreshToken = `${isValid ? "refreshToken" : "invalidRefreshToken"}-${role}`;

    document.cookie = `Authorization-refresh=${refreshToken}; Path=/; Max-Age=3600`;
  };

  const setAuthStore = ({
    role,
    isValidAccessToken,
    isValidRefreshToken,
  }: {
    role: Role;
    isValidAccessToken: boolean;
    isValidRefreshToken: boolean;
  }) => {
    if (role === null) {
      useAuthStore.setState({
        token: null,
        role: null,
        nickname: null,
      });
      // 쿠키 삭제
      document.cookie = `Authorization-refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      return;
    }

    useAuthStore.setState({
      token: `${isValidAccessToken ? "accessToken" : "invalidAccessToken"}-${role}`,
      role,
      nickname,
    });
    setRefreshToken({ role, isValid: isValidRefreshToken });
  };

  const setSocialUser = () => {
    useAuthStore.setState({
      role: "ROLE_USER",
      token: "accessToken-naver",
      nickname,
    });
    setRefreshToken({ role: "ROLE_USER", isValid: true });
  };

  return (
    <div className="absolute left-4 top-4">
      <h1 className="text-center title-2">Dev Tools</h1>
      <div className="flex flex-col gap-4 px-2 py-2 rounded-2xl">
        <Button
          colorType="primary"
          variant="filled"
          size="small"
          onClick={() =>
            setAuthStore({
              role: null,
              isValidAccessToken: true,
              isValidRefreshToken: true,
            })
          }
        >
          ROLE_NULL
        </Button>
        <Button
          colorType="primary"
          variant="filled"
          size="small"
          onClick={() =>
            setAuthStore({
              role: "ROLE_NONE",
              isValidAccessToken: true,
              isValidRefreshToken: true,
            })
          }
        >
          ROLE_NONE
        </Button>
        <Button
          colorType="primary"
          variant="filled"
          size="small"
          onClick={() =>
            setAuthStore({
              role: "ROLE_GUEST",
              isValidAccessToken: true,
              isValidRefreshToken: true,
            })
          }
        >
          ROLE_GUEST
        </Button>
        <Button
          colorType="primary"
          variant="filled"
          size="small"
          onClick={setSocialUser}
        >
          <p className="flex flex-col">
            <span>ROLE_USER</span>
            <span>Social Type : Naver</span>
          </p>
        </Button>
        <Button
          colorType="primary"
          variant="filled"
          size="small"
          onClick={() => {
            setAuthStore({
              role: "ROLE_USER",
              isValidAccessToken: true,
              isValidRefreshToken: true,
            });
          }}
        >
          <p className="flex flex-col">
            <span>ROLE_USER</span>
            <span>valid AT & valid RT</span>
          </p>
        </Button>
        <Button
          colorType="primary"
          variant="filled"
          size="small"
          onClick={() => {
            setAuthStore({
              role: "ROLE_USER",
              isValidAccessToken: false,
              isValidRefreshToken: true,
            });
          }}
        >
          <p className="flex flex-col">
            <span>ROLE_USER</span>
            <span>invalid AT & valid RT</span>
          </p>
        </Button>
        <Button
          colorType="primary"
          variant="filled"
          size="small"
          onClick={() => {
            setAuthStore({
              role: "ROLE_USER",
              isValidAccessToken: false,
              isValidRefreshToken: false,
            });
          }}
        >
          <p className="flex flex-col">
            <span>ROLE_USER</span>
            <span>invalid AT & invalid RT</span>
          </p>
        </Button>
      </div>
    </div>
  );
};

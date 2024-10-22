import { useState, useEffect } from "react";
import { useAuthStore } from "@/shared/store";
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
    window.matchMedia("(min-width: 1100px)").matches,
  );

  const nickname = "뽀송송";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1100px)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIsWideEnough(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      document.cookie = "Authorization-refresh=; path=/; max-age=0";
    };
  }, []);

  if (!isWideEnough) {
    return null;
  }

  // 눌리는 버튼에 따라 상태 변경
  const setAuthStore = (ROLE: string) => {
    switch (ROLE) {
      case "ROLE_NULL":
        useAuthStore.setState({
          token: null,
          role: null,
          nickname: null,
        });
        break;
      case "ROLE_NONE":
        useAuthStore.setState({
          token: "Bearer token",
          role: "ROLE_NONE",
          nickname: null,
        });
        break;
      case "ROLE_GUEST":
        useAuthStore.setState({
          token: "freshAccessTokenGuest",
          role: "ROLE_GUEST",
          nickname,
        });
        break;
      case "ROLE_USER": {
        useAuthStore.setState({
          token: "Bearer token",
          role: "ROLE_USER",
          nickname,
        });
        break;
      }
      default:
        return;
    }
  };

  const setStaleATandStaleRT = () => {
    useAuthStore.setState({
      role: "ROLE_USER",
      token: "staleAccessToken",
      nickname,
    });
    document.cookie =
      "Authorization-refresh=staleRefreshToken; path=/; max-age=3600";
  };

  const setStaleATandFreshRT = () => {
    useAuthStore.setState({
      role: "ROLE_USER",
      token: "staleAccessToken",
      nickname,
    });
    document.cookie =
      "Authorization-refresh=freshRefreshToken; path=/; max-age=3600";
  };

  const setSocialUser = () => {
    useAuthStore.setState({
      role: "ROLE_USER",
      token: "freshAccessToken-naver",
      nickname,
    });
    document.cookie =
      "Authorization-refresh=freshRefreshToken; path=/; max-age=3600";
  };

  // TODO 권한에 따라서 ProfileInfo 에 대한 useQuery InitialData 를 변경해야 합니다.

  return (
    <div className="absolute left-4 top-4">
      <h1 className="text-center title-2">Dev Tools</h1>
      <div className="flex flex-col gap-4 px-2 py-2 rounded-2xl">
        <Button
          colorType="primary"
          variant="filled"
          size="small"
          onClick={() => setAuthStore("ROLE_NULL")}
        >
          SET ROLE_NULL
        </Button>
        <Button
          colorType="primary"
          variant="filled"
          size="small"
          onClick={() => setAuthStore("ROLE_NONE")}
        >
          SET ROLE_NONE
        </Button>
        <Button
          colorType="primary"
          variant="filled"
          size="small"
          onClick={() => setAuthStore("ROLE_GUEST")}
        >
          SET ROLE_GUEST
        </Button>
        <Button
          colorType="primary"
          variant="filled"
          size="small"
          onClick={() => setAuthStore("ROLE_USER")}
        >
          SET ROLE_USER
        </Button>
        {/* 2014/10/05 refresh , access token 로직 추가 */}
        <Button
          colorType="primary"
          variant="filled"
          size="small"
          onClick={setStaleATandFreshRT}
        >
          <p className="flex flex-col">
            <span>ROLE_USER</span>
            <span>stale AT & fresh RT</span>
          </p>
        </Button>
        <Button
          colorType="primary"
          variant="filled"
          size="small"
          onClick={setStaleATandStaleRT}
        >
          <p className="flex flex-col">
            <span>ROLE_USER</span>
            <span>stale AT & stale RT</span>
          </p>
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
      </div>
    </div>
  );
};

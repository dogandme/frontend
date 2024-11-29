import { useRef } from "react";
import { getCookie, useDropdown } from "@/shared/lib";
import { type Role, useAuthStore } from "@/shared/store";
import { Button } from "@/shared/ui/button";
import { List } from "@/shared/ui/list";

// ! TODO
// ! 해당 컴포넌트는 개발 환경에서만 사용 되는 컴포넌트 입니다.
// ! main.ts 파일에서 렌더링 되며 import.meta.DEV 를 통해 개발 환경인지 확인합니다.
// ! 배포 시엔 해당 컴포넌트가 렌더링 되지 않지만 위험을 방지하기 위해 배포 시 해당 컴포넌트를 제거 해주세요
export const DevTools = () => {
  const { token: currentAccessToken, role: currentRole } = useAuthStore(
    (state) => ({
      token: state.token,
      role: state.role,
    }),
  );
  const currentRefreshToken = getCookie("Authorization-refresh");

  const ref = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useDropdown(ref);

  const setRefreshToken = (refreshToken: string | null) => {
    if (refreshToken === null) {
      // 쿠키 삭제
      document.cookie =
        "Authorization-refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } else {
      document.cookie = `Authorization-refresh=${refreshToken}; path=/; max-age=3600`;
    }
  };

  const createAccessToken = ({
    role,
    isValid,
  }: {
    role: NonNullable<Role>;
    isValid: boolean;
  }) => `${isValid ? "accessToken" : "invalidAccessToken"}-${role}`;
  const createRefreshToken = ({
    role,
    isValid,
  }: {
    role: NonNullable<Role>;
    isValid: boolean;
  }) => `${isValid ? "refreshToken" : "invalidRefreshToken"}-${role}`;

  const authConfigs: {
    role: Role;
    accessToken: string | null;
    refreshToken: string | null;
    label: string | React.ReactNode;
  }[] = [
    {
      role: null,
      accessToken: null,
      refreshToken: null,
      label: "ROLE_NULL",
    },
    {
      role: "ROLE_NONE",
      accessToken: createAccessToken({ role: "ROLE_NONE", isValid: true }),
      refreshToken: createRefreshToken({ role: "ROLE_NONE", isValid: true }),
      label: "ROLE_NONE",
    },
    {
      role: "ROLE_GUEST",
      accessToken: createAccessToken({ role: "ROLE_GUEST", isValid: true }),
      refreshToken: createRefreshToken({ role: "ROLE_GUEST", isValid: true }),
      label: "ROLE_GUEST",
    },
    {
      role: "ROLE_USER",
      accessToken: `${createAccessToken({ role: "ROLE_USER", isValid: true })}-naver`,
      refreshToken: createRefreshToken({ role: "ROLE_USER", isValid: true }),
      label: "ROLE_USER (Naver)",
    },
    {
      role: "ROLE_USER",
      accessToken: createAccessToken({ role: "ROLE_USER", isValid: true }),
      refreshToken: createRefreshToken({ role: "ROLE_USER", isValid: true }),
      label: (
        <p className="flex flex-col">
          <span>ROLE_USER</span>
          <span>valid AT & valid RT</span>
        </p>
      ),
    },
    {
      role: "ROLE_USER",
      accessToken: createAccessToken({ role: "ROLE_USER", isValid: false }),
      refreshToken: createRefreshToken({ role: "ROLE_USER", isValid: true }),
      label: (
        <p className="flex flex-col">
          <span>ROLE_USER</span>
          <span>invalid AT & valid RT</span>
        </p>
      ),
    },
    {
      role: "ROLE_USER",
      accessToken: createAccessToken({ role: "ROLE_USER", isValid: false }),
      refreshToken: createRefreshToken({ role: "ROLE_USER", isValid: false }),
      label: (
        <p className="flex flex-col">
          <span>ROLE_USER</span>
          <span>invalid AT & invalid RT</span>
        </p>
      ),
    },
  ];

  return (
    <div className="absolute left-4 top-4">
      <div className="relative" ref={ref}>
        <Button
          colorType="primary"
          variant="outlined"
          size="small"
          fullWidth={false}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Dev Tools
        </Button>

        <List
          className={`${isOpen ? "visible" : "hidden"} rounded-2xl shadow-custom-1 absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-grey-0 p-2 z-10 flex flex-col gap-4 `}
          style={{ width: "280px" }}
        >
          <div className="flex flex-col gap-2 body-3">
            <p>role: {`${currentRole}`}</p>
            <p>accessToken: {`${currentAccessToken}`}</p>
            <p>refreshToken: {`${currentRefreshToken}`}</p>
          </div>
          {authConfigs.map((config, index) => {
            const isActive =
              currentRole === config.role &&
              currentAccessToken === config.accessToken &&
              currentRefreshToken === config.refreshToken;

            return (
              <Button
                key={index}
                colorType="primary"
                variant={isActive ? "filled" : "outlined"}
                size="small"
                onClick={() => {
                  useAuthStore.setState({
                    role: config.role,
                    token: config.accessToken,
                    nickname: config.role === null ? null : "뽀송송",
                  });
                  setRefreshToken(config.refreshToken);
                  setIsOpen(false);
                }}
              >
                {config.label}
              </Button>
            );
          })}
        </List>
      </div>
    </div>
  );
};

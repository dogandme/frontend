import type { QueryClient } from "@tanstack/react-query";
import { AuthStore } from "@/shared/store";
import { APP_END_POINT, ERROR_MESSAGE } from "./constants";

export const getNewAccessToken = async ({
  setterMethods,
  queryClient,
}: {
  setterMethods: {
    setToken: AuthStore["setToken"];
    resetAuthStore: AuthStore["reset"];
  };
  queryClient: QueryClient;
}) => {
  const { setToken, resetAuthStore } = setterMethods;

  // 해당 try-catch 문은 access token 을 refresh token 을 이용해 재발급 받는 로직입니다.
  try {
    const response = await fetch(APP_END_POINT.REFRESH_ACCESS_TOKEN, {
      credentials:
        process.env.NODE_ENV === "development" ? "include" : "same-origin",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // 새로운 access token 을 AuthStore 에 저장합니다.
    // 토큰을 쿼리 키로 갖는 쿼리들은 자연스럽게 새로운 토큰을 사용하게 됩니다.
    setToken(data.content.authorization);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === ERROR_MESSAGE.REFRESH_TOKEN_INVALIDATED
    ) {
      /**
       * refresh 토큰이 유효하지 않다면 다음과 같은 일들을 처리 합니다.
       * 1. AuthStore 의 token, role, nickname 을 초기화 합니다.
       * 2. 캐싱 된 쿼리를 모두 초기화 합니다.
       */
      resetAuthStore();
      queryClient.clear();

      // 스토리북 환경의 경우엔 이하 코드를 실행 시키지 않습니다.
      // 스토리북은 react-router-dom을 사용하지 않기 때문입니다.
      if (
        (
          window as Window &
            typeof globalThis & { __STORYBOOK_ADDONS_CHANNEL__?: unknown }
        ).__STORYBOOK_ADDONS_CHANNEL__
      ) {
        return;
      }

      // 현재 ReactQueryProvider 는 ReactRouterDom 내부에 존재하지 않기에 window 를 이용해 직접 라우팅 시킵니다.
      // TODO : 추후 ReactQueryProvider 를 ReactRouterDom 내부로 이동시키고, useNavigate 를 이용해 라우팅 시키도록 수정합니다.
      // window.location.href = ROUTER_PATH.LOGIN;
      return;
    }

    throw error;
  }
};

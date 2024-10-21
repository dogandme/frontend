import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { useRouteHistoryStore } from "@/shared/store/history";

/**
 * 해당 컴포넌트는 / 경로 layout 상단에서 라우팅 경로를 추적합니다.
 * 경로에 따라 상태를 변경해야 하는 경우 해당 컴포넌트에서 작업 할 수 있습니다.
 */
export const HistoryTracker = () => {
  const { pathname } = useLocation();
  const setLastNoneAuthRoute = useRouteHistoryStore(
    (state) => state.setLastNoneAuthRoute,
  );

  useEffect(() => {
    const authPageRouterList: string[] = [
      ROUTER_PATH.LOGIN,
      ROUTER_PATH.LOGIN_BY_EMAIL,
      ROUTER_PATH.SIGN_UP,
      ROUTER_PATH.SIGN_UP_USER_INFO,
      ROUTER_PATH.SIGN_UP_PET_INFO,
      ROUTER_PATH.FORGET_PASSWORD,
      // 404 error 페이지 제외
      ROUTER_PATH.NOT_FOUND_USER,
    ];
    const isAuthRoute = authPageRouterList.includes(pathname);

    if (isAuthRoute) {
      return;
    }

    setLastNoneAuthRoute(pathname);
  }, [pathname, setLastNoneAuthRoute]);

  return null;
};

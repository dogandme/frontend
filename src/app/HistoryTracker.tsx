import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLastNoneAuthRouteStore } from "@/shared/store/history";
import { ROUTER_PATH } from "@/shared/constants";
/**
 * 해당 컴포넌트는 / 경로 layout 상단에서 라우팅 경로를 추적합니다.
 * 경로에 따라 상태를 변경해야 하는 경우 해당 컴포넌트에서 작업 할 수 있습니다.
 */
export const HistoryTracker = () => {
  const { pathname } = useLocation();
  const setLastNoneAuthRoute = useLastNoneAuthRouteStore(
    (state) => state.setLastNoneAuthRoute,
  );
  // 해당 이펙트는 라이팅 경로가 변경 될 때 마다 useLastNoneAuthRouteStore의 조건에 따라 상태 값을 변경합니다.
  useEffect(() => {
    const authPageRouterList: string[] = [
      ROUTER_PATH.LOGIN,
      ROUTER_PATH.LOGIN_BY_EMAIL,
      ROUTER_PATH.SIGN_UP,
      ROUTER_PATH.SIGN_UP_USER_INFO,
      ROUTER_PATH.SIGN_UP_PET_INFO,
      ROUTER_PATH.FORGET_PASSWORD,
    ];
    const isAuthRoute = authPageRouterList.includes(pathname);

    if (isAuthRoute) {
      return;
    }

    setLastNoneAuthRoute(pathname);
  }, [pathname, setLastNoneAuthRoute]);

  return null;
};

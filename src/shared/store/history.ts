import { create } from "zustand";

interface RouteHistoryStore {
  lastNoneAuthRoute: string;
  setLastNoneAuthRoute: (newRoute: string) => void;
}

/**
 * useRouteHistory 는 웹앱을 이용하면서 유저가 라우팅을 통해 이동한 경로를 추적합니다.
 * @param lastNoneAuthRoute - 인증이 필요한 페이지로 이동하기 전 마지막 경로
 * @param setLastNoneAuthRoute - 인증이 필요한 페이지로 이동하기 전 마지막 경로를 변경합니다.
 */
export const useRouteHistory = create<RouteHistoryStore>((set) => ({
  lastNoneAuthRoute: "/",
  setLastNoneAuthRoute: (newRoute: string) =>
    set({ lastNoneAuthRoute: newRoute }),
}));

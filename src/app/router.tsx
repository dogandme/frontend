import { createBrowserRouter, Outlet } from "react-router-dom";
import { LoginPage, LoginLayout } from "@/pages/login";
import { EmailLoginPage } from "@/pages/login/email";
import { MapPage } from "@/pages/map";
import { MyPage } from "@/pages/my-page";
import { SignUpPage } from "@/pages/sign-up";
import PetInfoPage from "@/pages/sign-up/pet-info/page";
import { UserInfoRegistrationPage } from "@/pages/sign-up/user-info";
import { ROUTER_PATH } from "@/shared/constants";
import { MainLayout, MainPage } from "../pages";
import { HistoryTracker } from "./HistoryTracker";
import { OverlayPortal } from "./OverlayPortal";
import { GlobalNavigationBar, MainFooter } from "./layout";

export const router = createBrowserRouter([
  {
    path: ROUTER_PATH.MAIN,
    element: (
      <MainLayout
        HistoryTracker={<HistoryTracker />}
        OverlayPortal={<OverlayPortal />}
        MainFooter={<MainFooter />}
      />
    ),
    children: [
      {
        index: true,
        element: <MainPage GlobalNavigationBar={<GlobalNavigationBar />} />, // 탐색
      },
      {
        path: ROUTER_PATH.MAP,
        element: <MapPage GlobalNavigationBar={<GlobalNavigationBar />} />, // 지도
      },
      {
        path: ROUTER_PATH.COMMUNITY,
        element: <div>community</div>, // 커뮤니티
      },
      {
        // TODO GNB 빼기
        // TODO 바텀시트 빼기
        path: ROUTER_PATH.MY_PAGE,
        element: <MyPage />,
      },
    ],
  },
  {
    path: ROUTER_PATH.LOGIN,
    element: (
      <LoginLayout
        OverlayPortal={<OverlayPortal />}
        HistoryTracker={<HistoryTracker />}
      />
    ),
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: ROUTER_PATH.LOGIN_BY_EMAIL,
        element: <EmailLoginPage />,
      },
      {
        path: ROUTER_PATH.FORGET_PASSWORD,
        element: <div>forgot-password</div>,
      },
    ],
  },
  {
    path: ROUTER_PATH.SIGN_UP,
    element: (
      <>
        <OverlayPortal />
        <HistoryTracker />
        <Outlet />
      </>
    ),
    children: [
      {
        index: true,
        element: <SignUpPage />,
      },
      {
        path: ROUTER_PATH.SIGN_UP_USER_INFO,
        element: <UserInfoRegistrationPage />,
      },
      {
        path: ROUTER_PATH.SIGN_UP_PET_INFO,
        element: <PetInfoPage />,
      },
    ],
  },
]);

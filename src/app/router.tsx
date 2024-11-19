import { createBrowserRouter } from "react-router-dom";
import { NotFoundUser, ProfilePage } from "@/pages/[nickname]";
import { FollowerPage } from "@/pages/[nickname]/follower";
import { FollowingPage } from "@/pages/[nickname]/following";
import { UserMarkingPage } from "@/pages/[nickname]/marking";
import { LoginPage, LoginLayout } from "@/pages/login";
import { EmailLoginPage } from "@/pages/login/email";
import { MapLayout, MapPage } from "@/pages/map";
import { MyMarkingPage } from "@/pages/map/my";
import { PlaceMarkingPage } from "@/pages/map/place";
import { SettingPage } from "@/pages/setting";
import { EditInfoPage } from "@/pages/setting/edit-info/page";
import { AccountManagementPage } from "@/pages/setting/manage-account";
import { SignUpPage } from "@/pages/sign-up";
import PetInfoPage from "@/pages/sign-up/pet-info/page";
import { UserInfoRegistrationPage } from "@/pages/sign-up/user-info";
import { TemporaryMarkingPage } from "@/pages/temporary-marking";
import { MyActivityList } from "@/widgets/map/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { ErrorBoundary, MainPage } from "../pages";
import { AppProviderLayout } from "./AppProviderLayout";

export const router = createBrowserRouter([
  {
    path: ROUTER_PATH.MAIN,
    element: <AppProviderLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <MainPage />, // 지도로 라우팅 시키는 경로 , 추후 탐색 페이지로 변경 되어야 함
      },
      {
        path: ROUTER_PATH.MAP,
        element: <MapLayout />, // 지도
        children: [
          {
            index: true,
            element: <MapPage />,
          },
          {
            path: ROUTER_PATH.PLACE,
            element: <PlaceMarkingPage />,
          },
          {
            path: ROUTER_PATH.MY_MARK,
            element: <MyMarkingPage />,
          },
          {
            path: ROUTER_PATH.MY_ACTIVITY,
            element: <MyActivityList />,
          },
        ],
      },
      {
        path: ROUTER_PATH.PROFILE,
        errorElement: <NotFoundUser />,
        children: [
          {
            index: true,
            element: <ProfilePage />,
          },
          {
            path: ROUTER_PATH.USER_MARKING,
            element: <UserMarkingPage />,
          },
          {
            path: ROUTER_PATH.FOLLOWINGS,
            element: <FollowingPage />,
          },
          {
            path: ROUTER_PATH.FOLLOWERS,
            element: <FollowerPage />,
          },
        ],
      },

      {
        path: ROUTER_PATH.SETTING,
        children: [
          {
            index: true,
            element: <SettingPage />,
          },
          {
            path: ROUTER_PATH.MANAGE_ACCOUNT,
            element: <AccountManagementPage />,
          },
          {
            path: ROUTER_PATH.EDIT_MY_INFO,
            element: <EditInfoPage />,
          },
        ],
      },
      {
        path: ROUTER_PATH.LOGIN,
        element: <LoginLayout />,
        children: [
          {
            index: true,
            element: <LoginPage />,
          },
          {
            path: ROUTER_PATH.LOGIN_BY_EMAIL,
            element: <EmailLoginPage />,
          },
        ],
      },
      {
        path: ROUTER_PATH.SIGN_UP,
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
      {
        path: ROUTER_PATH.TEMPORARY_MARKING,
        element: <TemporaryMarkingPage />,
      },
    ],
  },
]);

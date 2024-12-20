import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { ErrorBoundary } from "../pages";
import { AppProviderLayout } from "./AppProviderLayout";

const MainPage = lazy(() => import("@/pages"));

const MapLayout = lazy(() =>
  import("@/pages/map").then((module) => ({ default: module.MapLayout })),
);
const MapPage = lazy(() =>
  import("@/pages/map").then((module) => ({ default: module.MapPage })),
);
const PlaceMarkingPage = lazy(() => import("@/pages/map/place"));
const MyMarkingPage = lazy(() => import("@/pages/map/my"));
const MyActivityList = lazy(() => import("@/widgets/map/ui"));

const ProfilePage = lazy(() => import("@/pages/[nickname]"));
const UserMarkingPage = lazy(() => import("@/pages/[nickname]/marking"));
const FollowingPage = lazy(() => import("@/pages/[nickname]/following"));
const FollowerPage = lazy(() => import("@/pages/[nickname]/follower"));
const NotFoundUser = lazy(() => import("@/pages/[nickname]/notFoundUser"));

const LoginPage = lazy(() =>
  import("@/pages/login").then((module) => ({
    default: module.LoginPage,
  })),
);

const LoginLayout = lazy(() =>
  import("@/pages/login").then((module) => ({ default: module.LoginLayout })),
);

const EmailLoginPage = lazy(() => import("@/pages/login/email"));
const SettingPage = lazy(() => import("@/pages/setting"));
const EditInfoPage = lazy(() => import("@/pages/setting/edit-info"));
const AccountManagementPage = lazy(
  () => import("@/pages/setting/manage-account"),
);
const SignUpPage = lazy(() => import("@/pages/sign-up"));
const PetInfoPage = lazy(() => import("@/pages/sign-up/pet-info"));
const UserInfoRegistrationPage = lazy(
  () => import("@/pages/sign-up/user-info"),
);
const TemporaryMarkingPage = lazy(() => import("@/pages/temporary-marking"));

export const router = createBrowserRouter([
  {
    path: ROUTER_PATH.MAIN,
    element: <AppProviderLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense>
            <MainPage />
          </Suspense>
        ),
      },
      {
        path: ROUTER_PATH.MAP,
        element: (
          <Suspense>
            <MapLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense>
                <MapPage />
              </Suspense>
            ),
          },
          {
            path: ROUTER_PATH.PLACE,
            element: (
              <Suspense>
                <PlaceMarkingPage />
              </Suspense>
            ),
          },
          {
            path: ROUTER_PATH.MY_MARK,
            element: (
              <Suspense>
                <MyMarkingPage />
              </Suspense>
            ),
          },
          {
            path: ROUTER_PATH.MY_ACTIVITY,
            element: (
              <Suspense>
                <MyActivityList />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: ROUTER_PATH.PROFILE,
        errorElement: (
          <Suspense>
            <NotFoundUser />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense>
                <ProfilePage />
              </Suspense>
            ),
          },
          {
            path: ROUTER_PATH.USER_MARKING,
            element: (
              <Suspense>
                <UserMarkingPage />
              </Suspense>
            ),
          },
          {
            path: ROUTER_PATH.FOLLOWINGS,
            element: (
              <Suspense>
                <FollowingPage />
              </Suspense>
            ),
          },
          {
            path: ROUTER_PATH.FOLLOWERS,
            element: (
              <Suspense>
                <FollowerPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: ROUTER_PATH.SETTING,
        children: [
          {
            index: true,
            element: (
              <Suspense>
                <SettingPage />
              </Suspense>
            ),
          },
          {
            path: ROUTER_PATH.MANAGE_ACCOUNT,
            element: (
              <Suspense>
                <AccountManagementPage />
              </Suspense>
            ),
          },
          {
            path: ROUTER_PATH.EDIT_MY_INFO,
            element: (
              <Suspense>
                <EditInfoPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: ROUTER_PATH.LOGIN,
        element: (
          <Suspense>
            <LoginLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense>
                <LoginPage />
              </Suspense>
            ),
          },
          {
            path: ROUTER_PATH.LOGIN_BY_EMAIL,
            element: (
              <Suspense>
                <EmailLoginPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: ROUTER_PATH.SIGN_UP,
        children: [
          {
            index: true,
            element: (
              <Suspense>
                <SignUpPage />
              </Suspense>
            ),
          },
          {
            path: ROUTER_PATH.SIGN_UP_USER_INFO,
            element: (
              <Suspense>
                <UserInfoRegistrationPage />
              </Suspense>
            ),
          },
          {
            path: ROUTER_PATH.SIGN_UP_PET_INFO,
            element: (
              <Suspense>
                <PetInfoPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: ROUTER_PATH.TEMPORARY_MARKING,
        element: (
          <Suspense>
            <TemporaryMarkingPage />
          </Suspense>
        ),
      },
    ],
  },
]);

import { createBrowserRouter, Outlet } from "react-router-dom";
import { MainLayout, MainPage } from "../pages";
import { LoginPage, LoginLayout } from "@/pages/login";
import { ROUTER_PATH } from "@/shared/constants";
import { SignUpPage } from "@/pages/sign-up";

export const router = createBrowserRouter([
  {
    path: ROUTER_PATH.MAIN,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
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
            path: "email",
            element: <div>email login</div>,
          },
          {
            path: "forgot-password",
            element: <div>forgot-password</div>,
          },
        ],
      },

      {
        path: ROUTER_PATH.SIGN_UP,
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <SignUpPage />,
          },
          {
            path: "user-info",
            element: <div>user-info</div>,
          },
          {
            path: "pet-info",
            element: <div>pet-info</div>,
          },
        ],
      },
    ],
  },
]);

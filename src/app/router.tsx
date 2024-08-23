import { createBrowserRouter, Outlet } from "react-router-dom";
import { MainLayout, MainPage } from "../pages";
import { LoginLayout, LoginPage } from "@/pages/login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },

      {
        path: "login",
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
        path: "sign-up",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <div>sign-up</div>,
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

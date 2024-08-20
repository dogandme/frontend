import { createBrowserRouter, Outlet } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Outlet />
      </>
    ),
    children: [
      {
        index: true,
        element: <div>home</div>,
      },

      {
        path: "login",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <div>login</div>,
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

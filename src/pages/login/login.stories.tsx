import { Meta, StoryObj } from "@storybook/react";
<<<<<<< HEAD
import LoginLayout from "./layout";
import LoginPage from "./page";
=======
import { LoginLayout, LoginPage } from ".";
>>>>>>> cc91675 (feat[#52] : /login 경로 페이지 생성)
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout";

const meta: Meta = {
  title: "Pages/login",
<<<<<<< HEAD
=======
  tags: ["pages"],
>>>>>>> cc91675 (feat[#52] : /login 경로 페이지 생성)
  parameters: {
    docs: {
      description: {
        component: "/login 경로에 대한 페이지입니다.",
      },
    },
  },
<<<<<<< HEAD
  decorators: [
    (Story) => (
      <div className="w-96 border border-grey-300">
        <Story />
      </div>
    ),
  ],
=======
>>>>>>> cc91675 (feat[#52] : /login 경로 페이지 생성)
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Routes>
      <Route element={<MainLayout />}>
        <Route element={<LoginLayout />}>
          <Route index element={<LoginPage />} />
        </Route>
      </Route>
    </Routes>
  ),
};

import { Meta, StoryObj } from "@storybook/react";
import { LoginLayout, LoginPage } from ".";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout";

const meta: Meta = {
  title: "Pages/login",
  tags: ["pages"],
  parameters: {
    docs: {
      description: {
        component: "/login 경로에 대한 페이지입니다.",
      },
    },
  },
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

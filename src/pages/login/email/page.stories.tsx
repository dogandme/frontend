import { Routes, Route } from "react-router-dom";
import { Meta, StoryObj } from "@storybook/react";
import EmailLoginPage from "./page";
import MainLayout from "@/pages/layout";
import LoginLayout from "../layout";

const meta: Meta<typeof EmailLoginPage> = {
  title: "Pages/login/email",
  tags: ["autodocs", "pages"],
  parameters: {
    docs: {
      description: {
        component: "/login/email 경로에 대한 페이지입니다.",
      },
    },
  },
};

export default meta;

export const Default: StoryObj<typeof EmailLoginPage> = {
  render: () => (
    <Routes>
      <Route element={<MainLayout />}>
        <Route element={<LoginLayout />}>
          <Route index element={<EmailLoginPage />} />
        </Route>
      </Route>
    </Routes>
  ),
};

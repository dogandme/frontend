import { Meta, StoryObj } from "@storybook/react";
import LoginPage from "./page";
import { Routes, Route } from "react-router-dom";

const meta: Meta = {
  title: "Pages/login",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "/login 경로에 대한 페이지입니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 border border-grey-300">
        <main className="flex flex-col items-start gap-8 self-stretch px-4 pb-32 pt-8">
          <Story />
        </main>
      </div>
    ),
  ],
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Routes>
      <Route index element={<LoginPage />} />
    </Routes>
  ),
};

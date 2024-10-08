import { Routes, Route } from "react-router-dom";
import { Meta, StoryObj } from "@storybook/react";
import { AppProviderLayout } from "@/app/AppProviderLayout";
import EmailLoginPage from "./page";

const meta: Meta<typeof EmailLoginPage> = {
  title: "Pages/Login/Email",
  tags: ["pages, autodocs"],
  component: EmailLoginPage,
  decorators: [
    (Story) => (
      <div className="w-96 border border-grey-300">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof EmailLoginPage>;

export const Default: Story = {
  render: () => (
    <Routes>
      <Route element={<AppProviderLayout />}>
        <Route index element={<EmailLoginPage />} />
      </Route>
    </Routes>
  ),
};

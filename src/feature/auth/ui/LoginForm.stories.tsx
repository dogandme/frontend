import { Meta, StoryObj } from "@storybook/react";
import LoginForm from "./LoginForm";

const meta: Meta = {
  title: "Feature/Auth/LoginForm",
  tags: ["autodocs", "feature"],
  parameters: {
    docs: {
      description: {
        component: "로그인 폼 컴포넌트입니다.",
      },
    },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="w-[360px] border border-grey-300 px-4 py-2">
      <LoginForm />
    </div>
  ),
};

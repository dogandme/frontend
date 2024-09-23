import { Meta, StoryObj } from "@storybook/react";
import { OverlayPortal } from "@/app";
import { LogoutButton } from "./LogoutButton";

export default {
  title: "features/profile/LogoutButton",
  component: LogoutButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "/my-page/setting 에서 사용되는 로그아웃 버튼입니다. 클릭 시 로그아웃을 하겠냐는 모달이 나타나며, 확인 버튼을 누를 경우 로그아웃이 되고 / 경로로 라우팅 됩니다.",
      },
    },
  },
} as Meta;

type Story = StoryObj<typeof LogoutButton>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div id="root" className="h-96">
        <OverlayPortal />
        <Story />
      </div>
    ),
  ],

  render: () => <LogoutButton />,
};

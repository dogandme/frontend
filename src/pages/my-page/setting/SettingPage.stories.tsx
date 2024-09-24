import { Meta, StoryObj } from "@storybook/react";
import { OverlayPortal } from "@/app";
import { SettingPage } from "./page";

export default {
  title: "pages/MyPage/setting",
  component: SettingPage,
} as Meta;

type Story = StoryObj<typeof SettingPage>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div id="root" className="h-96">
        <OverlayPortal />
        <Story />
      </div>
    ),
  ],

  render: () => <SettingPage />,
};

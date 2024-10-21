import { Meta, StoryObj } from "@storybook/react";
import { OverlayPortal } from "@/app/OverlayPortal";
import { SettingPage } from "./page";

export default {
  title: "pages/my-page/setting",
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

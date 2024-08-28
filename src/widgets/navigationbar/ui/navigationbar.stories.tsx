import { Meta, StoryObj } from "@storybook/react";
import BackwardNavigationBar from "./BackwardNavigationBar";
import { CloseNavigationBar } from "./CloseNavigationBar";

const meta: Meta<typeof BackwardNavigationBar> = {
  title: "Widgets/NavigationBar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "상단 네비게이션 바를 모아둔 스토리북입니다.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof BackwardNavigationBar>;

export const Default: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-10">
        <div className="w-[360px] px-2 py-2">
          <h1>BackwardNavigationBar</h1>
          <div className="border">
            <BackwardNavigationBar />
          </div>
          <h1>CloseNavigationBar</h1>
          <div className="border">
            <CloseNavigationBar />
          </div>
        </div>
      </div>
    );
  },
};

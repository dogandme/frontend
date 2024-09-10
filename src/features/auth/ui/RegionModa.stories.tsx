import { Meta, StoryObj } from "@storybook/react";
import { RegionModal } from "./RegionModal";

const meta: Meta<typeof RegionModal> = {
  title: "features/auth/RegionModal",
  tags: ["features", "auth"],
  parameters: {
    docs: {
      description: {
        component: "지역 설정 모달입니다.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof RegionModal>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div id="root" className="w-96">
        <Story />
      </div>
    ),
  ],

  render: () => {
    return (
      <div className="flex flex-col gap-10">
        <div className="w-[360px] px-2 py-2">
          <RegionModal onClose={async () => {}} />
        </div>
      </div>
    );
  },
};

import { StoryObj } from "@storybook/react";
import { ChangeNickNameModal } from "./_ChangeNickNameModal";

export default {
  title: "features/setting/ChangeNickNameModal",
  component: ChangeNickNameModal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "닉네임 변경 모달입니다.",
      },
    },
  },
};

type Story = StoryObj<typeof ChangeNickNameModal>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],

  render: () => <ChangeNickNameModal onClose={async () => {}} />,
};

import { StoryObj } from "@storybook/react";
import { createModifyUserInfoStore } from "../store";
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
      <div className="w-96 h-96">
        <Story />
      </div>
    ),
  ],

  render: () => (
    <ChangeNickNameModal
      onClose={async () => {}}
      store={createModifyUserInfoStore({
        nickname: "뽀송이",
        gender: "여자",
        age: "20대",
        regionList: [
          "영등포동 1가",
          "영등포동 2가",
          "영등포동 3가",
          "영등포동 4가",
          "영등포동 5가",
        ],
      })}
    />
  ),
};

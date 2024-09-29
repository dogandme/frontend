import { StoryObj } from "@storybook/react";
import { createModifyUserInfoStore } from "../store";
import { ChangeNicknameModal } from "./_ChangeNicknameModal";

export default {
  title: "features/setting/ChangeNicknameModal",
  component: ChangeNicknameModal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "닉네임 변경 모달입니다.",
      },
    },
  },
};

type Story = StoryObj<typeof ChangeNicknameModal>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-96 h-96">
        <Story />
      </div>
    ),
  ],

  render: () => (
    <ChangeNicknameModal
      onClose={async () => {}}
      store={createModifyUserInfoStore({
        nickname: "뽀송이",
        gender: "여자",
        age: "20대",
        region: [
          { id: 1, address: "영등포동 1가" },
          { id: 2, address: "영등포동 2가" },
          { id: 3, address: "영등포동 3가" },
          { id: 4, address: "영등포동 4가" },
          { id: 5, address: "영등포동 5가" },
        ],
      })}
    />
  ),
};

import { StoryObj } from "@storybook/react";
import { EmailInput } from "@/entities/auth/ui";
import { FormModal } from "./FormModal";

export default {
  title: "shared/modal/FormModal",
  component: FormModal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ConfirmModal과 동일한 기능을 가지고 있으며 버튼들의 UI가 다릅니다. Form 모달의 버튼은 Stack 형태로 존재하며 버튼의 순서와 디자인 시스템 상 버튼의 타입이 다릅니다.",
      },
    },
  },
};

type Story = StoryObj<typeof FormModal>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],

  render: () => (
    <FormModal
      onClose={async () => {}}
      title="이메일 변경"
      confirmText="저장하기"
      closeText="취소"
    >
      <EmailInput id="." label="이메일 입력하기" essential />
    </FormModal>
  ),
};

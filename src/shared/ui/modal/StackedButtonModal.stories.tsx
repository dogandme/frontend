import { StoryObj } from "@storybook/react";
import { EmailInput } from "@/entities/auth/ui";
import { StackedButtonModal } from "./StackedButtonModal";

export default {
  title: "shared/modal/StackedButtonModal",
  component: StackedButtonModal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ConfirmModal과 동일한 기능을 가지고 있으며 버튼들의 UI가 다릅니다. StackedButtonModal의 버튼은 Stack 형태로 존재하며 버튼의 순서와 디자인 시스템 상 버튼의 타입이 다릅니다.",
      },
    },
  },
  argTypes: {
    onClose: {
      description:
        "모달을 닫는 함수로 useModal을 통해 생성된 onClose 메소드를 받습니다.",
    },
    children: {
      description: "버튼과 타이틀을 제외 한 모달 내부 컨텐츠를 받습니다.",
    },
    closeIconAriaLabel: {
      description: "닫기 아이콘의 aria-label을 설정합니다.",
    },
    title: {
      description: "모달의 제목을 설정합니다.",
    },
    ConfirmButton: {
      description:
        "확인 버튼에 특별을 커스텀하여 사용 합니다. 만약 주입되지 않은 경우엔 DefaultConfirmButton을 사용합니다.",
    },
    CloseButton: {
      description:
        "취소 버튼에 특별을 커스텀하여 사용 합니다. 만약 주입되지 않은 경우엔 DefaultCloseButton을 사용합니다.",
    },
    onConfirm: {
      description:
        "DefaultConfirmButton의 버튼 클릭 시 실행할 함수를 받습니다. ConfirmButton 이 주입되지 않았을 경우에만 전달 가능 합니다.",
    },
    closeText: {
      description: "DefaultCloseButton의 텍스트를 설정합니다.",
    },
    confirmText: {
      description: "DefaultConfirmButton의 텍스트를 설정합니다.",
    },
  },
};
type Story = StoryObj<typeof StackedButtonModal>;
export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-96 h-96">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <StackedButtonModal onClose={async () => {}} title="이메일 변경">
      <EmailInput id="." label="이메일 입력하기" essential />
    </StackedButtonModal>
  ),
};

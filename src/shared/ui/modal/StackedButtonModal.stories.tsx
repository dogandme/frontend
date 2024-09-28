import { StoryObj } from "@storybook/react";
import { EmailInput } from "@/entities/auth/ui";
import { StackedButtonModal } from "./StackedButtonModal";

export default {
  title: "shared/modal/FormModal",
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
        "확인 버튼에 특별을 커스텀하여 사용 합니다. 내부 기본 텍스트는 저장하기 이며 클릭 시 onClose 함수를 실행합니다. 만약 UI를 유지 한 채로 비즈니스 로직을 주입하고 싶다면 onConfirm 메소드를 건내줘 사용 가능 합니다.",
    },
    CloseButton: {
      description:
        "취소 버튼에 특별을 커스텀하여 사용 합니다. 내부 기본 텍스트는 취소 이며 클릭 시 onClose 함수를 실행합니다.",
    },
    onConfirm: {
      description: "ConfirmButton의 버튼 클릭 시 실행할 함수를 받습니다.",
    },
    closeText: {
      description: "CloseButton의 텍스트를 설정합니다.",
    },
    confirmText: {
      description: "ConfirmButton의 텍스트를 설정합니다.",
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

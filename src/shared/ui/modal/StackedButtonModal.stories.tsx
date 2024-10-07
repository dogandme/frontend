import { StoryObj } from "@storybook/react";
import { EmailInput } from "@/entities/auth/ui";
import { useModal } from "@/shared/lib";
import { OverlayPortal } from "@/app";
import { ConfirmModal } from "./ConfirmModal";
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
    onConfirm: {
      description:
        "DefaultConfirmButton의 버튼 클릭 시 실행할 함수를 받습니다. onConfirm 의 경우 반환 값으로 truthy 값을 반환하는 경우 onClose 메소드의 실행을 중지 시킬 수 있습니다.",
    },
    closeText: {
      description: "취소 버튼의 텍스트를 설정합니다. 기본 값은 취소 입니다.",
    },
    confirmText: {
      description: "저장 버튼의 텍스트를 설정합니다. 기본 값은 저장 입니다.",
    },
  },
};
type Story = StoryObj<typeof StackedButtonModal>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-96 h-96" id="root">
        <OverlayPortal />
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

const WithConfirmFlagTemplate = ({
  onClose,
}: {
  onClose: () => Promise<void>;
}) => {
  const handleConfirm = () => {
    alert("서버로 요청을 보냈습니다!");
    onClose();
  };

  const { onClose: onCloseConfirmModal, handleOpen: handleOpenConfirmModal } =
    useModal(() => (
      <ConfirmModal
        onClose={onCloseConfirmModal}
        confirmText="진짜 저장"
        onConfirm={handleConfirm}
        title="onClose를 중지 시키고 나타난 ConfirmModal"
      >
        닉네임 변경 후 한 달간은 재변경이 불가능합니다. 정말 변경하시겠습니까?
      </ConfirmModal>
    ));

  return (
    <StackedButtonModal
      onClose={onClose}
      onConfirm={() => {
        handleOpenConfirmModal();
        return true;
      }}
      title="이메일 변경"
    >
      <EmailInput
        id="."
        label="이메일 입력하기"
        essential
        defaultValue="example@naver.com"
      />
    </StackedButtonModal>
  );
};

export const WithConfirmFlag: Story = {
  decorators: Default.decorators,
  render: () => {
    /* eslint-disable */
    const { handleOpen, onClose } = useModal(() => (
      <WithConfirmFlagTemplate onClose={onClose} />
    ));

    return (
      <button
        className="btn-3 bg-tangerine-200 px-2 py-2 roudned-2xl"
        onClick={handleOpen}
      >
        {" "}
        모달 열기 !
      </button>
    );
  },
};

import { action } from "@storybook/addon-actions";
import { StoryObj } from "@storybook/react";
import { EmailInput } from "@/entities/auth/ui";
import { useModal } from "@/shared/lib";
import { OverlayPortal } from "@/app";
import { Modal } from "./Modal";
import { StackedButtonModal } from "./StackedButtonModal";

export default {
  title: "shared/modal/StackedButtonModal",
  tags: ["autodocs"],
  component: StackedButtonModal,
  parameters: {
    docs: {
      description: {
        component:
          "취소 , 확인 기능이 존재하는 StackedButtonModal 입니다. `onConfirm` 함수를 통해 확인 버튼을 눌렀을 때의 동작을, `onClose` 함수를 통해 취소 버튼을 눌렀을 때의 동작을 정의 할 수 있습니다. `StackedButtonModal은` `Modal` 컴포넌트를 기반으로 하며 `useOverlay` 메소드와 함께 사용 되어야 합니다.<br/><br/> `StackedButtonModal` 은 취소, 확인 등 `props`로 받은 메소드가 실행 되면 모달이 닫히는 것이 보장 됩니다. `onConfirm` 메소드 실행 후 내부적으로 `onClose` 메소드를 실행하기 때문입니다. ",
      },
    },
  },
  argTypes: {
    onClose: {
      description:
        "StackedButtonModal 을 닫을 때 실행되는 함수 입니다. useModal의 반환값으로 받은 onClose 함수를 사용하면 됩니다. 해당 메소드는 취소에 해당하는 버튼을 클릭 할 때도 실행 되고 확인에도 해당하는 버튼을 클릭 할 때에도 실행 됩니다.",
    },
    onConfirm: {
      description:
        "StackedButtonModal 을 호출 한 컴포넌트에서 정의 된 비지니스 로직을 실행하는 함수 입니다. 해당 버튼은 `StackedButtonModal` 내부에서 확인에 해당하는 버튼이 클릭 시 실행됩니다.",
    },
    children: {
      description: "StackedButtonModal 내부에 표시 될 컨텐츠 입니다.",
    },
    confirmText: {
      description: "확인 버튼의 텍스트를 지정합니다.",
    },
    closeText: {
      description: "취소 버튼의 텍스트를 지정합니다.",
    },
    closeIconAriaLabel: {
      description: "취소 버튼의 아이콘의 `aria-label`을 지정합니다.",
    },
    title: {
      description: "StackedButtonModal 의 최상단에 렌더링 될 제목 입니다.",
    },
  },
};

type Story = StoryObj<typeof StackedButtonModal>;

// 어떤 모달
const SomethingModal = ({
  onCloseSomethingModal,
}: {
  onCloseSomethingModal: () => Promise<void>;
}) => {
  const { handleOpen, onClose: onCloseLogoutStackedButtonModal } = useModal(
    () => (
      <ChangeEmailModal
        onConfirm={onCloseSomethingModal}
        onCloseStackedButtonModal={onCloseLogoutStackedButtonModal}
      />
    ),
  );

  return (
    <Modal modalType="center">
      <p>방가 방가 방가워요</p>
      <button
        onClick={handleOpen}
        className="border border-tangerine-500 px-2 py-2 rounded-2xl"
      >
        이메일 변경 모달 열기
      </button>
    </Modal>
  );
};

// features 레이어에서 모달을 정의했다고 가정
const ChangeEmailModal = ({
  onConfirm,
  onCloseStackedButtonModal,
}: {
  onConfirm: () => void | Promise<void>;
  onCloseStackedButtonModal: () => Promise<void>;
}) => {
  const resetStore = () => {
    action("서버로 이메일을 보냅니다! 얍!")();
    onConfirm();
  };

  return (
    <StackedButtonModal
      onConfirm={resetStore}
      onClose={onCloseStackedButtonModal}
      title="이메일을 변경하시겠습니까 ?"
      confirmText="저장하기"
      closeText="나가기"
    >
      <EmailInput id="." label="이메일" essential />
    </StackedButtonModal>
  );
};

const App = () => {
  const { handleOpen, onClose } = useModal(() => (
    <SomethingModal onCloseSomethingModal={onClose} />
  ));

  return (
    <button
      onClick={handleOpen}
      className="border border-tangerine-500 px-2 py-2 rounded-2xl"
    >
      어떤 모달 열기
    </button>
  );
};

export const Default: Story = {
  decorators: [
    (Story) => (
      <div id="root">
        <OverlayPortal />
        <div className="w-96 h-44">
          <Story />
        </div>
      </div>
    ),
  ],

  render: App,
};

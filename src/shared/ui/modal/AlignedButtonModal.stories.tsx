import { action } from "@storybook/addon-actions";
import { StoryObj } from "@storybook/react";
import { useModal } from "@/shared/lib";
import { OverlayPortal } from "@/app";
import { AlignedButtonModal } from "./AlignedButtonModal";
import { Modal } from "./Modal";

export default {
  title: "shared/modal/AlignedButtonModal",
  tags: ["autodocs"],
  component: AlignedButtonModal,
  parameters: {
    docs: {
      description: {
        component:
          "취소 , 확인 기능이 존재하는 AlignedButtonModal 입니다. `onConfirm` 함수를 통해 확인 버튼을 눌렀을 때의 동작을, `onClose` 함수를 통해 취소 버튼을 눌렀을 때의 동작을 정의 할 수 있습니다. `AlignedButtonModal은` `Modal` 컴포넌트를 기반으로 하며 `useOverlay` 메소드와 함께 사용 되어야 합니다.<br/><br/> `AlignedButtonModal` 은 취소, 확인 등 `props`로 받은 메소드가 실행 되면 모달이 닫히는 것이 보장 됩니다. `onConfirm` 메소드 실행 후 내부적으로 `onClose` 메소드를 실행하기 때문입니다. ",
      },
    },
  },
  argTypes: {
    onClose: {
      description:
        "AlignedButtonModal 을 닫을 때 실행되는 함수 입니다. useModal의 반환값으로 받은 onClose 함수를 사용하면 됩니다. 해당 메소드는 취소에 해당하는 버튼을 클릭 할 때도 실행 되고 확인에도 해당하는 버튼을 클릭 할 때에도 실행 됩니다.",
    },
    onConfirm: {
      description:
        "AlignedButtonModal 을 호출 한 컴포넌트에서 정의 된 비지니스 로직을 실행하는 함수 입니다. 해당 버튼은 `AlignedButtonModal` 내부에서 확인에 해당하는 버튼이 클릭 시 실행됩니다.",
    },
    children: {
      description: "AlignedButtonModal 내부에 표시 될 컨텐츠 입니다.",
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
      description: "AlignedButtonModal 의 최상단에 렌더링 될 제목 입니다.",
    },
  },
};

type Story = StoryObj<typeof AlignedButtonModal>;

// 어떤 모달
const SomethingModal = ({
  onCloseSomethingModal,
}: {
  onCloseSomethingModal: () => Promise<void>;
}) => {
  const { handleOpen, onClose: onCloseLogoutAlignedButtonModal } = useModal(
    () => (
      <_ConfirmLeaveModal
        onConfirm={onCloseSomethingModal}
        onCloseAlignedButtonModal={onCloseLogoutAlignedButtonModal}
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
        저장 안하고 나가기
      </button>
    </Modal>
  );
};

// features 레이어에서 모달을 정의했다고 가정
const _ConfirmLeaveModal = ({
  onConfirm,
  onCloseAlignedButtonModal,
}: {
  onConfirm: () => void | Promise<void>;
  onCloseAlignedButtonModal: () => Promise<void>;
}) => {
  const resetStore = () => {
    action("스토어를 초기화 합니다 얍!")(); // Logout 내부에서 정의 된 비즈니스 로직
    onConfirm();
  };

  return (
    <AlignedButtonModal
      onConfirm={resetStore}
      onClose={onCloseAlignedButtonModal}
      title="화면을 나가시겠습니까?"
    >
      <p>화면을 나갈 경우 입력한 정보들이 모두 삭제 됩니다</p>
      <p>정말 화면을 나가시겠습니까?</p>
    </AlignedButtonModal>
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

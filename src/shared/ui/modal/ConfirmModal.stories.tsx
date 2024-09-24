import { action } from "@storybook/addon-actions";
import { StoryObj } from "@storybook/react";
import { useModal } from "@/shared/lib";
import { OverlayPortal } from "@/app";
import { ConfirmModal } from "./ConfirmModal";
import { Modal } from "./Modal";

export default {
  title: "shared/modal/ConfirmModal",
  tags: ["autodocs"],
  component: ConfirmModal,
  parameters: {
    docs: {
      description: {
        component:
          "ConfirmModal 입니다. 일어나는 인터릭센은 X, 취소 , 확인 버튼이 있습니다.",
      },
    },
  },
};

type Story = StoryObj<typeof ConfirmModal>;

// 어떤 모달
const SomethingModal = ({
  onCloseSomethingModal,
}: {
  onCloseSomethingModal: () => Promise<void>;
}) => {
  const { handleOpen, onClose: onCloseLogoutConfirmModal } = useModal(() => (
    <_LogoutConfirmModal
      resolve={onCloseSomethingModal}
      onCloseConfirmModal={onCloseLogoutConfirmModal}
    />
  ));

  return (
    <Modal modalType="center">
      <p>방가 방가 방가워요</p>
      <button
        onClick={handleOpen}
        className="border border-tangerine-500 px-2 py-2 rounded-2xl"
      >
        모달 닫기
      </button>
    </Modal>
  );
};

// features 레이어에서 모달을 정의했다고 가정
const _LogoutConfirmModal = ({
  resolve,
  onCloseConfirmModal,
}: {
  resolve: () => void | Promise<void>;
  onCloseConfirmModal: () => void | Promise<void>;
}) => {
  const setLogout = () => {
    action("로그아웃 합니다!"); // Logout 내부에서 정의 된 비즈니스 로직
    resolve();
  };

  return (
    <ConfirmModal
      resolve={setLogout}
      onCloseConfirmModal={onCloseConfirmModal}
      title="화면을 나가시겠습니까?"
    >
      <p>화면을 나갈 경우 입력한 정보들이 모두 삭제 됩니다.</p>
      <p>정말 화면을 나가시겠습니까?</p>
    </ConfirmModal>
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
        <div className="w-96">
          <Story />
        </div>
      </div>
    ),
  ],

  render: App,
};

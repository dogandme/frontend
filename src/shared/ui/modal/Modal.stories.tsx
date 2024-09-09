import { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { OverlayPortal } from "@/app/OverlayPortal";
import { useModal } from "@/shared/lib/overlay";
import { CenterModal, FullPageModal } from "./Modal.mocks";

const meta: Meta<typeof Modal> = {
  title: "shared/Modal",
  component: Modal,
};

export default meta;

export const Default: StoryObj<typeof Modal> = {
  decorators: [
    (Story) => (
      <div id="root">
        <OverlayPortal />
        <Story />
      </div>
    ),
  ],

  render: () => {
    /*eslint-disable*/
    const { handleOpen: handleOpenCenterModal, onClose: onCloseCenterModal } =
      useModal(
        () => <CenterModal onClose={onCloseCenterModal} id="animation" />,
        {
          beforeClose: async () => {
            const $modal = document.getElementById("animation")!;
            $modal.style.transition = "opacity 0.2s";
            $modal.style.opacity = "0";
            await new Promise((resolve) => setTimeout(resolve, 200));
          },
        },
      );

    const {
      handleOpen: handleOpenFullPageModal,
      onClose: onCloseFullPageModal,
    } = useModal(() => <FullPageModal onClose={onCloseFullPageModal} />);

    return (
      <div className="flex h-96 flex-col justify-between rounded-2xl border px-2 py-2">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa aliquid
          nostrum odit. Quam veritatis, illo aut perferendis ea modi culpa,
          necessitatibus officiis laboriosam beatae, exercitationem aliquid
          vitae id non. Reiciendis!
        </p>
        <div className="flex items-end justify-end">
          <div className="flex gap-2 py-2">
            <button
              className="rounded-xl border px-2 py-2 text-tangerine-500"
              onClick={handleOpenCenterModal}
            >
              Center Modal 열기
            </button>
            <button
              className="rounded-xl border px-2 py-2 text-tangerine-500"
              onClick={handleOpenFullPageModal}
            >
              FullPage Modal 열기
            </button>
          </div>
        </div>
      </div>
    );
  },
};

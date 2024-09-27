import { StoryObj } from "@storybook/react";
import { ExitConfirmModal } from "./ExitConfirmModal";

export default {
  title: "shared/modal/ExitConfirmModal",
  component: ExitConfirmModal,
  parameters: {
    docs: {
      description: {
        component:
          "화면을 나가시겠습니까? 모달입니다. ConfirmModal 을 상속 받아 만들어졌으며 title, children, closeText 가 정적으로 결정 되어 있습니다.",
      },
    },
  },
};

type Story = StoryObj<typeof ExitConfirmModal>;

export const Default: Story = {
  render: () => <ExitConfirmModal onClose={async () => {}} />,
};

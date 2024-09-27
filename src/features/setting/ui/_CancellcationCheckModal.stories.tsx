import { StoryObj } from "@storybook/react";
import { CancellationCheckModal } from "./_CancellationCheckModal";

export default {
  title: "features/setting/CancellationCheckModal",
  component: CancellationCheckModal,
};

type Story = StoryObj<typeof CancellationCheckModal>;

export const Default: Story = {
  render: () => <CancellationCheckModal onClose={async () => {}} />,
};

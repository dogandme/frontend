import { StoryObj } from "@storybook/react";
import { AccountCancellationModal } from "./_AccountCancellationModal";

export default {
  title: "features/setting/AccountCancellationModal",
  component: AccountCancellationModal,
};

type Story = StoryObj<typeof AccountCancellationModal>;

export const Default: Story = {
  render: () => <AccountCancellationModal onClose={async () => {}} />,
};

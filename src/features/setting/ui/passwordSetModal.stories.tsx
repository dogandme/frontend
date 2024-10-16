import { StoryObj } from "@storybook/react";
import { PasswordSetModal } from "./passwordSetModal";

export default {
  title: "features/setting/PasswordSetModal",
  component: PasswordSetModal,
};

type Story = StoryObj<typeof PasswordSetModal>;

export const Default: Story = {
  render: () => <PasswordSetModal onClose={async () => {}} />,
};

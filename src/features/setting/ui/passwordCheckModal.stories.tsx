import { StoryObj } from "@storybook/react";
import { PasswordCheckModal } from "./passwordCheckModal";

export default {
  title: "features/setting/PasswordCheckModal",
  component: PasswordCheckModal,
};

type Story = StoryObj<typeof PasswordCheckModal>;

export const Default: Story = {
  render: () => <PasswordCheckModal onClose={async () => {}} />,
};

import type { Meta, StoryObj } from "@storybook/react";

import UserInfoRegistrationForm from "./UserInfoRegistrationForm";

const meta: Meta<typeof UserInfoRegistrationForm> = {
  title: "features/auth/UserInfoRegistrationForm",
  component: UserInfoRegistrationForm,
  tags: ["autodocs"],
  args: {},
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof UserInfoRegistrationForm>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <UserInfoRegistrationForm />
    </div>
  ),
};

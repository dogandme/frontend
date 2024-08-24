import { within, userEvent, expect } from "@storybook/test";
import { Meta, StoryObj } from "@storybook/react";
import { EmailInput, PasswordInput } from "./Input";

const meta: Meta = {
  title: "Auth/entities/Input",
};

export default meta;

type Story = StoryObj<typeof PasswordInput>;

export const Id: Story = {
  args: {
    label: "이메일",
    id: "email",
    statusText: "이메일 형식으로 입력해주세요",
  },
  render: (args) => (
    <div className="w-[300px] border border-grey-300 px-2 py-2">
      <EmailInput {...args} />
    </div>
  ),
};

export const Password: Story = {
  args: {
    label: "비밀번호",
    id: "password",
    placeholder: "비밀번호를 입력해주세요",
  },

  render: (args) => (
    <div className="w-[300px] border border-grey-300 px-2 py-2">
      <PasswordInput {...args} />
    </div>
  ),

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const $passwordInput = canvasElement.querySelector("input");
    if (!$passwordInput) {
      throw new Error("input element not found");
    }
    const $visibilityButton = canvas.getByRole("button");

    expect($passwordInput.getAttribute("type")).toBe("password");
    await userEvent.type($passwordInput, "123456");
    await userEvent.click($visibilityButton);
    expect($passwordInput.getAttribute("type")).toBe("text");
    await userEvent.click($visibilityButton);
    expect($passwordInput.getAttribute("type")).toBe("password");
  },
};

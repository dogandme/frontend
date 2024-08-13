import { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import Input from "./Input"; // Input 컴포넌트의 경로를 확인하세요
import { expect } from "@storybook/test";

const meta: Meta<typeof Input> = {
  component: Input,
  title: "Example/Input",
  argTypes: {
    value: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const UserEvent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    await userEvent.type(input, "Hello, World!");
    expect(input).toHaveValue("Hello, World!");
  },
};

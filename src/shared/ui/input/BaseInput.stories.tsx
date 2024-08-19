import type { Meta, StoryObj } from "@storybook/react";
import CommonInput, { InputProps } from "./BaseInput";

const meta: Meta<typeof CommonInput> = {
  component: CommonInput,
  title: "shared/Input",
  argTypes: {
    componentType: {
      control: {
        type: "select",
        options: ["textfieldOutlined", "textfieldFilled"],
      },
    },
    condition: {
      control: { type: "select", options: ["default", "error"] },
    },
    additionalOutterStyle: {
      control: {
        type: "object",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CommonInput>;

export const Default: Story = {
  args: {
    title: "Title",
    id: "sample-id",
    componentType: "outLinedTextInput",
    condition: "default",
    isSupporingNeeded: true,
    supportingText: "Supporting text",
    additionalOutterStyle: {
      width: "328px",
    },
  } as InputProps,
};

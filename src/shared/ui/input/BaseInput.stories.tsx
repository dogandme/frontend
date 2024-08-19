import type { Meta, StoryObj } from "@storybook/react";
import CommonInput, { InputProps } from "./BaseInput";

const meta: Meta<typeof CommonInput> = {
  component: CommonInput,
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
    componentType: "textfieldOutlined",
    condition: "default",
    isSupporingNeeded: true,
    supporingText: "Supporting text",
    additionalOutterStyle: {
      width: "328px",
    },
  } as InputProps,
};

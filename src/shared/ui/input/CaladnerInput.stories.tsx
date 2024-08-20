import type { Meta, StoryObj } from "@storybook/react";
import CalanderInput from "./CalanderInput";

const meta: Meta<typeof CalanderInput> = {
  component: CalanderInput,
  title: "shared/Input/CaledarInput",
  argTypes: {
    additionalOutterStyle: {
      condtrol: {
        type: "object",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CalanderInput>;
export const Default: Story = {
  args: {
    title: "Title",
    id: "sample-id",
    componentType: "calanderInput",
    condition: "default",
    placeholder: "Placeholder",
    supportingText: "Supporting text",
    additionalOutterStyle: {
      width: "328px",
    },
  },
};

export const CalanderInputWithError: Story = {
  args: {
    ...Default.args,
    condition: "error",
  },
};

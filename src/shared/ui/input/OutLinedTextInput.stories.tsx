import type { Meta, StoryObj } from "@storybook/react";
import OutLinedTextInput from "./OutlinedTextInput";

const meta: Meta<typeof OutLinedTextInput> = {
  component: OutLinedTextInput,
  title: "shared/Input/OutLinedTextInput",
  argTypes: {
    additionalOutterStyle: {
      control: {
        type: "object",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof OutLinedTextInput>;

export const Default: Story = {
  args: {
    title: "Title",
    id: "sample-id",
    componentType: "outLinedTextInput",
    condition: "default",
    supportingText: "Supporting text",
    additionalOutterStyle: {
      width: "328px",
    },
  },
};

export const OutLinedTextInputWithError: Story = {
  args: {
    ...Default.args,
    condition: "error",
  },
};

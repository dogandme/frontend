import type { Meta, StoryObj } from "@storybook/react";
import PlainTextInput from "./PlainTextInput";

const meta: Meta<typeof PlainTextInput> = {
  component: PlainTextInput,
  title: "shared/Input/PlainTextInput",
  argTypes: {
    additionalOutterStyle: {
      control: {
        type: "object",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PlainTextInput>;

export const Default: Story = {
  args: {
    title: "Title",
    id: "sample-id",
    componentType: "plainTextInput",
    condition: "default",
    supportingText: "Supporting text",
    additionalOutterStyle: {
      width: "328px",
    },
  },
};

export const PlainTextInputWithError: Story = {
  args: {
    ...Default.args,
    condition: "error",
  },
};

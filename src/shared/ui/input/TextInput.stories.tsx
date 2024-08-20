import type { Meta, StoryObj } from "@storybook/react";
import TextInput from "./TextInput";

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: "shared/Input/TextInput",
  argTypes: {
    additionalOutterStyle: {
      control: {
        type: "object",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    title: "Title",
    id: "sample-id",
    designType: "textInput",
    condition: "default",
    supportingText: "Supporting text",
    placeholder: "Placeholder",
    additionalOutterStyle: {
      width: "328px",
    },
  },
};

export const TextInputWithError: Story = {
  args: {
    ...Default.args,
    condition: "error",
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import TextField from "./TextField";

const meta: Meta<typeof TextField> = {
  component: TextField,
  title: "shared/Input/TextField",
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    title: "Title",
    id: "sample-id",
    condition: "default",
    supportingText: "Supporting text",
    additionalOutterStyle: {
      width: "328px",
    },
  },
};

export const TextFieldWithError: Story = {
  args: {
    ...Default.args,
    condition: "error",
  },
};

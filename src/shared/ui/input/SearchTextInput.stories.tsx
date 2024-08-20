import type { Meta, StoryObj } from "@storybook/react";
import SearchTextInput from "./SearchTextInput";

const meta: Meta<typeof SearchTextInput> = {
  component: SearchTextInput,
  title: "shared/Input/SearchTextInput",
  argTypes: {
    additionalOutterStyle: {
      control: {
        type: "object",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SearchTextInput>;

export const Default: Story = {
  args: {
    id: "sample-id",
    defaultValue: "",
    designType: "searchTextInput",
    condition: "default",
    additionalOutterStyle: {
      width: "328px",
    },
    placeholder: "Placeholder",
  },
};

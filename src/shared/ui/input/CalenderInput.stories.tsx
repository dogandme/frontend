import type { Meta, StoryObj } from "@storybook/react";
import CalenderInput from "./CalendarInput";

const meta: Meta<typeof CalenderInput> = {
  component: CalenderInput,
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

type Story = StoryObj<typeof CalenderInput>;
export const Default: Story = {
  args: {
    title: "Title",
    id: "sample-id",
    designType: "calanderInput",
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

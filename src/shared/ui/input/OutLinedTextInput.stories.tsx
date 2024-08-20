import type { Meta, StoryObj } from "@storybook/react";
import OutLinedTextInput from "./OutLinedTextInput";

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
    designType: "outLinedTextInput",
    condition: "default",
    placeholder: "Placeholder",
    supportingText: "Supporting text",
    additionalOutterStyle: {
      width: "328px",
    },
    leadingIcon: (
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 20.7207C2 21.8253 2.89543 22.7207 4 22.7207H20C21.1046 22.7207 22 21.8253 22 20.7207V4.7207C22 3.61613 21.1046 2.7207 20 2.7207H4C2.89543 2.7207 2 3.61613 2 4.7207V20.7207Z"
          fill="#9E9E9E"
        />
      </svg>
    ),
    countArea: <span className="body-2 text-grey-700">00:00</span>,
    trailingIcon: (
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 20.7207C2 21.8253 2.89543 22.7207 4 22.7207H20C21.1046 22.7207 22 21.8253 22 20.7207V4.7207C22 3.61613 21.1046 2.7207 20 2.7207H4C2.89543 2.7207 2 3.61613 2 4.7207V20.7207Z"
          fill="#9E9E9E"
        />
      </svg>
    ),
  },
};

export const OutLinedTextInputWithError: Story = {
  args: {
    ...Default.args,
    condition: "error",
  },
};

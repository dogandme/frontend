import type { Meta, StoryObj } from "@storybook/react";
import TimerTextInput from "./TimerTextInput";

const meta: Meta<typeof TimerTextInput> = {
  component: TimerTextInput,
  title: "shared/Input/TimerTextInput",
  argTypes: {
    additionalOutterStyle: {
      control: {
        type: "object",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimerTextInput>;

export const Default: Story = {
  args: {
    title: "Title",
    id: "sample-id",
    designType: "timerTextInput",
    condition: "default",
    supportingText: "Supporting text",
    additionalOutterStyle: {
      width: "328px",
    },
    countArea: <span className="body-2 text-grey-700">00:00</span>,
    trailingIcon: (
      <svg
        width="24 "
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_352_12263)">
          <path
            d="M2 20.3281C2 21.4327 2.89543 22.3281 4 22.3281H20C21.1046 22.3281 22 21.4327 22 20.3281V4.32813C22 3.22356 21.1046 2.32812 20 2.32812H4C2.89543 2.32812 2 3.22356 2 4.32812V20.3281Z"
            fill="#9E9E9E"
          />
        </g>
        <defs>
          <clipPath id="clip0_352_12263">
            <rect
              width="24"
              height="24"
              fill="white"
              transform="translate(0 0.328125)"
            />
          </clipPath>
        </defs>
      </svg>
    ),
  },
};

export const TimerTextInputWithError: Story = {
  args: {
    ...Default.args,
    condition: "error",
  },
};

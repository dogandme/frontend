import type { Meta, StoryObj } from "@storybook/react";

import IconButton from "./IconButton";
import { EmailIcon } from "../icon";

const meta: Meta<typeof IconButton> = {
  title: "shared/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: {
    colorType: "primary",
    size: "medium",
  },
  argTypes: {
    colorType: {
      description: "버튼의 색상을 결정합니다.",
      options: ["primary", "secondary"],
      control: { type: "radio" },
    },
    size: {
      description: "버튼의 크기를 결정합니다.",
      options: ["xSmall", "small", "medium", "large"],
      control: { type: "radio" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  render: ({ colorType, size }) => (
    <IconButton iconComponent={EmailIcon} colorType={colorType} size={size} />
  ),
};

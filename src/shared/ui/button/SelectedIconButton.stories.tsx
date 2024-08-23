import type { Meta, StoryObj } from "@storybook/react";

import SelectedIconButton from "./SelectedIconButton";
import { EmailIcon } from "../icon";

const meta: Meta<typeof SelectedIconButton> = {
  title: "shared/SelectedIconButton",
  component: SelectedIconButton,
  tags: ["autodocs"],
  args: {
    isSelected: true,
    size: "medium",
  },
  argTypes: {
    isSelected: {
      description: "선택된 상태인지 여부를 결정합니다.",
      control: { type: "boolean" },
    },
    size: {
      description: "버튼의 크기를 결정합니다.",
      options: ["xSmall", "small", "medium", "large"],
      control: { type: "radio" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SelectedIconButton>;

export const Default: Story = {
  render: ({ isSelected, size }) => (
    <SelectedIconButton
      iconComponent={EmailIcon}
      isSelected={isSelected}
      size={size}
    />
  ),
};

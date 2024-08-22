import type { Meta, StoryObj } from "@storybook/react";

import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "shared/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    colorType: {
      description: "배지의 색상을 결정합니다.",
      options: ["primary", "secondary"],
      control: { type: "radio" },
    },
    children: {
      description: "배지에 표시할 내용입니다.",
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    colorType: "primary",
  },
  render: ({ colorType }) => {
    return (
      <div className="flex items-center gap-1">
        <Badge colorType={colorType} />
        <Badge colorType={colorType}>3</Badge>
        <Badge colorType={colorType}>text</Badge>
      </div>
    );
  },
};

export const Badges: Story = {
  args: {
    colorType: "primary",
  },
  argTypes: {
    colorType: {
      table: {
        disable: true,
      },
    },
  },
  render: () => {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <Badge colorType="primary" />
          <Badge colorType="primary">3</Badge>
          <Badge colorType="primary">text</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Badge colorType="secondary" />
          <Badge colorType="secondary">3</Badge>
          <Badge colorType="secondary">text</Badge>
        </div>
      </div>
    );
  },
};

export const DotBadge: Story = {
  args: {
    colorType: "primary",
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  render: ({ colorType }) => {
    return <Badge colorType={colorType} />;
  },
};

export const BadgeWithContent: Story = {
  args: {
    colorType: "primary",
  },
  render: ({ colorType, children }) => {
    return <Badge colorType={colorType}>{children}</Badge>;
  },
};

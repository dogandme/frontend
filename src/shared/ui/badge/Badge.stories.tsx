import type { Meta, StoryObj } from "@storybook/react";

import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "shared/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      description: "배지의 종류를 결정합니다.",
      options: ["dot", "num", "text"],
      control: { type: "radio" },
    },
    colorType: {
      description: "배지의 색상을 결정합니다.",
      options: ["primary", "secondary"],
      control: { type: "radio" },
    },
    text: {
      description: "variant가 text일 때, 배지의 텍스트입니다.",
      control: { type: "text" },
    },
    number: {
      description: "variant가 num일 때, 배지의 숫자입니다.",
      control: { type: "number" },
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
        <Badge variant="dot" colorType={colorType} />
        <Badge variant="num" colorType={colorType} number={3} />
        <Badge variant="text" colorType={colorType} text="text" />
      </div>
    );
  },
};

export const Badges: Story = {
  argTypes: {
    variant: {
      table: {
        disable: true,
      },
    },
    colorType: {
      table: {
        disable: true,
      },
    },
    text: {
      table: {
        disable: true,
      },
    },
    number: {
      table: {
        disable: true,
      },
    },
  },
  render: () => {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <Badge variant="dot" colorType="primary" />
          <Badge variant="num" colorType="primary" number={3} />
          <Badge variant="text" colorType="primary" text="text" />
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="dot" colorType="secondary" />
          <Badge variant="num" colorType="secondary" number={3} />
          <Badge variant="text" colorType="secondary" text="text" />
        </div>
      </div>
    );
  },
};

export const DotBadge: Story = {
  args: {
    variant: "dot",
  },
  argTypes: {
    variant: {
      table: {
        disable: true,
      },
    },
    text: {
      table: {
        disable: true,
      },
    },
    number: {
      table: {
        disable: true,
      },
    },
  },
};

export const NumBadge: Story = {
  args: {
    variant: "num",
    number: 3,
  },
  argTypes: {
    variant: {
      table: {
        disable: true,
      },
    },
    text: {
      table: {
        disable: true,
      },
    },
  },
};

export const TextBadge: Story = {
  args: {
    variant: "text",
    text: "text",
  },
  argTypes: {
    variant: {
      table: {
        disable: true,
      },
    },
    number: {
      table: {
        disable: true,
      },
    },
  },
};

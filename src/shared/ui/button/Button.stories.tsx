import type { Meta, StoryObj } from "@storybook/react";

import Button from "./Button";
import { EmailIcon as IconExample } from "../icon";

const meta: Meta<typeof Button> = {
  title: "shared/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    colorType: "primary",
    variant: "filled",
    size: "xSmall",
  },
  argTypes: {
    colorType: {
      description: "버튼의 색상을 결정합니다.",
      options: ["primary", "secondary", "tertiary"],
      control: { type: "radio" },
    },
    variant: {
      description: "버튼의 스타일을 결정합니다.",
      options: ["filled", "outlined", "text"],
      control: { type: "radio" },
    },
    size: {
      description: "버튼의 크기를 결정합니다.",
      options: ["xSmall", "small", "medium", "large"],
      control: { type: "radio" },
    },
    disabled: {
      description: "버튼의 비활성화 여부를 결정합니다.",
      control: { type: "boolean" },
    },
    fullWidth: {
      description: "버튼의 너비를 최대로 설정합니다.",
      control: { type: "boolean" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

// todo: 아이콘 공통 컴포넌트로 바꾸기

export const Default: Story = {
  args: {
    colorType: "primary",
    variant: "filled",
    size: "xSmall",
    disabled: false,
    fullWidth: false,
  },
  render: ({ colorType, variant, size, disabled, fullWidth }) => {
    return (
      <div className="flex items-center gap-4">
        <Button
          colorType={colorType}
          variant={variant}
          size={size}
          disabled={disabled}
          fullWidth={fullWidth}
        >
          <IconExample />
        </Button>
        <Button
          colorType={colorType}
          variant={variant}
          size={size}
          disabled={disabled}
          fullWidth={fullWidth}
        >
          button
        </Button>
        <Button
          colorType={colorType}
          variant={variant}
          size={size}
          disabled={disabled}
          fullWidth={fullWidth}
        >
          <IconExample />
          button
        </Button>
        <Button
          colorType={colorType}
          variant={variant}
          size={size}
          disabled={disabled}
          fullWidth={fullWidth}
        >
          button
          <IconExample />
        </Button>
      </div>
    );
  },
};

export const OnlyIcon: Story = {
  args: {
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story: "아이콘만 있는 경우입니다.",
      },
    },
  },
  render: ({ colorType, variant, size, disabled, fullWidth }) => {
    return (
      <Button
        colorType={colorType}
        variant={variant}
        size={size}
        disabled={disabled}
        fullWidth={fullWidth}
      >
        <IconExample />
      </Button>
    );
  },
};

export const OnlyText: Story = {
  args: {
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story: "텍스트만 있는 경우입니다.",
      },
    },
  },
  render: ({ colorType, variant, size, disabled, fullWidth }) => {
    return (
      <Button
        colorType={colorType}
        variant={variant}
        size={size}
        disabled={disabled}
        fullWidth={fullWidth}
      >
        button
      </Button>
    );
  },
};

export const IconFirst: Story = {
  args: {
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story: "아이콘이 먼저 있고, 그 뒤에 텍스트가 오는 경우입니다.",
      },
    },
  },
  render: ({ colorType, variant, size, disabled, fullWidth }) => {
    return (
      <Button
        colorType={colorType}
        variant={variant}
        size={size}
        disabled={disabled}
        fullWidth={fullWidth}
      >
        <IconExample />
        button
      </Button>
    );
  },
};

export const TextFirst: Story = {
  args: {
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story: "텍스트가 먼저 있고, 그 뒤에 아이콘 오는 경우입니다.",
      },
    },
  },
  render: ({ colorType, variant, size, disabled, fullWidth }) => {
    return (
      <Button
        colorType={colorType}
        variant={variant}
        size={size}
        disabled={disabled}
        fullWidth={fullWidth}
      >
        button
        <IconExample />
      </Button>
    );
  },
};

export const Sizes: Story = {
  args: {
    fullWidth: false,
  },
  argTypes: {
    size: {
      control: { disable: true },
    },
    disabled: {
      control: { disable: true },
    },
  },
  render: ({ colorType, variant, fullWidth }) => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-1">
          <h1 className="title-1 mr-4">only icon</h1>
          <Button
            colorType={colorType}
            variant={variant}
            size="xSmall"
            fullWidth={fullWidth}
          >
            <IconExample />
          </Button>
          <Button
            colorType={colorType}
            variant={variant}
            size="small"
            fullWidth={fullWidth}
          >
            <IconExample />
          </Button>
          <Button
            colorType={colorType}
            variant={variant}
            size="medium"
            fullWidth={fullWidth}
          >
            <IconExample />
          </Button>
          <Button
            colorType={colorType}
            variant={variant}
            size="large"
            fullWidth={fullWidth}
          >
            <IconExample />
          </Button>
        </div>

        <div className="flex gap-1">
          <h1 className="title-1 mr-4">only text</h1>
          <Button
            colorType={colorType}
            variant={variant}
            size="xSmall"
            fullWidth={fullWidth}
          >
            xSmall
          </Button>
          <Button
            colorType={colorType}
            variant={variant}
            size="small"
            fullWidth={fullWidth}
          >
            small
          </Button>
          <Button
            colorType={colorType}
            variant={variant}
            size="medium"
            fullWidth={fullWidth}
          >
            medium
          </Button>
          <Button
            colorType={colorType}
            variant={variant}
            size="large"
            fullWidth={fullWidth}
          >
            large
          </Button>
        </div>

        <div className="flex gap-1">
          <h1 className="title-1 mr-4">icon first</h1>
          <Button
            colorType={colorType}
            variant={variant}
            size="xSmall"
            fullWidth={fullWidth}
          >
            <IconExample />
            xSmall
          </Button>
          <Button
            colorType={colorType}
            variant={variant}
            size="small"
            fullWidth={fullWidth}
          >
            <IconExample />
            small
          </Button>
          <Button
            colorType={colorType}
            variant={variant}
            size="medium"
            fullWidth={fullWidth}
          >
            <IconExample />
            medium
          </Button>
          <Button
            colorType={colorType}
            variant={variant}
            size="large"
            fullWidth={fullWidth}
          >
            <IconExample />
            large
          </Button>
        </div>

        <div className="flex gap-1">
          <h1 className="title-1 mr-4">text first</h1>
          <Button
            colorType={colorType}
            variant={variant}
            size="xSmall"
            fullWidth={fullWidth}
          >
            xSmall
            <IconExample />
          </Button>
          <Button
            colorType={colorType}
            variant={variant}
            size="small"
            fullWidth={fullWidth}
          >
            small
            <IconExample />
          </Button>
          <Button
            colorType={colorType}
            variant={variant}
            size="medium"
            fullWidth={fullWidth}
          >
            medium
            <IconExample />
          </Button>
          <Button
            colorType={colorType}
            variant={variant}
            size="large"
            fullWidth={fullWidth}
          >
            large
            <IconExample />
          </Button>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: "버튼이 비활성화된 경우입니다.",
      },
    },
  },
  args: {
    disabled: true,
    fullWidth: false,
  },
  argTypes: {
    colorType: {
      control: { disable: true },
    },
    variant: {
      control: { disable: true },
    },
  },
  render: ({ size, disabled, fullWidth }) => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-1">
          <Button
            colorType="primary"
            variant="filled"
            size={size}
            disabled={disabled}
            fullWidth={fullWidth}
          >
            button
          </Button>
          <Button
            colorType="primary"
            variant="outlined"
            size={size}
            disabled={disabled}
            fullWidth={fullWidth}
          >
            button
          </Button>
          <Button
            colorType="primary"
            variant="text"
            size={size}
            disabled={disabled}
            fullWidth={fullWidth}
          >
            button
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            colorType="secondary"
            variant="filled"
            size={size}
            disabled={disabled}
            fullWidth={fullWidth}
          >
            button
          </Button>
          <Button
            colorType="secondary"
            variant="outlined"
            size={size}
            disabled={disabled}
            fullWidth={fullWidth}
          >
            button
          </Button>
          <Button
            colorType="secondary"
            variant="text"
            size={size}
            disabled={disabled}
            fullWidth={fullWidth}
          >
            button
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            colorType="tertiary"
            variant="filled"
            size={size}
            disabled={disabled}
            fullWidth={fullWidth}
          >
            button
          </Button>
          <Button
            colorType="tertiary"
            variant="outlined"
            size={size}
            disabled={disabled}
            fullWidth={fullWidth}
          >
            button
          </Button>
          <Button
            colorType="tertiary"
            variant="text"
            size={size}
            disabled={disabled}
            fullWidth={fullWidth}
          >
            button
          </Button>
        </div>
      </div>
    );
  },
};

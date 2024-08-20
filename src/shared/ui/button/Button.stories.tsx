import type { Meta, StoryObj } from "@storybook/react";

import Button from "./Button";

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
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

// todo: 아이콘 공통 컴포넌트로 바꾸기
const IconExample = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="icon/open_window">
        <path
          id="icon"
          d="M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H12V5H5V19H19V12H21V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM9.7 15.7L8.3 14.3L17.6 5H14V3H21V10H19V6.4L9.7 15.7Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

export const Default: Story = {
  args: {
    colorType: "primary",
    variant: "filled",
    size: "xSmall",
    disabled: false,
  },
  render: ({ colorType, variant, size, disabled }) => {
    return (
      <div className="flex items-center gap-4">
        <Button
          colorType={colorType}
          variant={variant}
          size={size}
          disabled={disabled}
        >
          <IconExample />
        </Button>
        <Button
          colorType={colorType}
          variant={variant}
          size={size}
          disabled={disabled}
        >
          button
        </Button>
        <Button
          colorType={colorType}
          variant={variant}
          size={size}
          disabled={disabled}
        >
          <IconExample />
          button
        </Button>
        <Button
          colorType={colorType}
          variant={variant}
          size={size}
          disabled={disabled}
        >
          button
          <IconExample />
        </Button>
      </div>
    );
  },
};

export const OnlyIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: "아이콘만 있는 경우입니다.",
      },
    },
  },
  render: ({ colorType, variant, size, disabled }) => {
    return (
      <Button
        colorType={colorType}
        variant={variant}
        size={size}
        disabled={disabled}
      >
        <IconExample />
      </Button>
    );
  },
};

export const OnlyText: Story = {
  parameters: {
    docs: {
      description: {
        story: "텍스트만 있는 경우입니다.",
      },
    },
  },
  render: ({ colorType, variant, size, disabled }) => {
    return (
      <Button
        colorType={colorType}
        variant={variant}
        size={size}
        disabled={disabled}
      >
        button
      </Button>
    );
  },
};

export const IconFirst: Story = {
  parameters: {
    docs: {
      description: {
        story: "아이콘이 먼저 있고, 그 뒤에 텍스트가 오는 경우입니다.",
      },
    },
  },
  render: ({ colorType, variant, size, disabled }) => {
    return (
      <Button
        colorType={colorType}
        variant={variant}
        size={size}
        disabled={disabled}
      >
        <IconExample />
        button
      </Button>
    );
  },
};

export const TextFirst: Story = {
  parameters: {
    docs: {
      description: {
        story: "텍스트가 먼저 있고, 그 뒤에 아이콘 오는 경우입니다.",
      },
    },
  },
  render: ({ colorType, variant, size, disabled }) => {
    return (
      <Button
        colorType={colorType}
        variant={variant}
        size={size}
        disabled={disabled}
      >
        button
        <IconExample />
      </Button>
    );
  },
};

export const Sizes: Story = {
  argTypes: {
    size: {
      control: { disable: true },
    },
    disabled: {
      control: { disable: true },
    },
  },
  render: ({ colorType, variant }) => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-1">
          <h1 className="title-1 mr-4">only icon</h1>
          <Button colorType={colorType} variant={variant} size="xSmall">
            <IconExample />
          </Button>
          <Button colorType={colorType} variant={variant} size="small">
            <IconExample />
          </Button>
          <Button colorType={colorType} variant={variant} size="medium">
            <IconExample />
          </Button>
          <Button colorType={colorType} variant={variant} size="large">
            <IconExample />
          </Button>
        </div>

        <div className="flex gap-1">
          <h1 className="title-1 mr-4">only text</h1>
          <Button colorType={colorType} variant={variant} size="xSmall">
            xSmall
          </Button>
          <Button colorType={colorType} variant={variant} size="small">
            small
          </Button>
          <Button colorType={colorType} variant={variant} size="medium">
            medium
          </Button>
          <Button colorType={colorType} variant={variant} size="large">
            large
          </Button>
        </div>

        <div className="flex gap-1">
          <h1 className="title-1 mr-4">icon first</h1>
          <Button colorType={colorType} variant={variant} size="xSmall">
            <IconExample />
            xSmall
          </Button>
          <Button colorType={colorType} variant={variant} size="small">
            <IconExample />
            small
          </Button>
          <Button colorType={colorType} variant={variant} size="medium">
            <IconExample />
            medium
          </Button>
          <Button colorType={colorType} variant={variant} size="large">
            <IconExample />
            large
          </Button>
        </div>

        <div className="flex gap-1">
          <h1 className="title-1 mr-4">text first</h1>
          <Button colorType={colorType} variant={variant} size="xSmall">
            xSmall
            <IconExample />
          </Button>
          <Button colorType={colorType} variant={variant} size="small">
            small
            <IconExample />
          </Button>
          <Button colorType={colorType} variant={variant} size="medium">
            medium
            <IconExample />
          </Button>
          <Button colorType={colorType} variant={variant} size="large">
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
  },
  argTypes: {
    colorType: {
      control: { disable: true },
    },
    variant: {
      control: { disable: true },
    },
  },
  render: ({ size, disabled }) => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-1">
          <Button
            colorType="primary"
            variant="filled"
            size={size}
            disabled={disabled}
          >
            button
          </Button>
          <Button
            colorType="primary"
            variant="outlined"
            size={size}
            disabled={disabled}
          >
            button
          </Button>
          <Button
            colorType="primary"
            variant="text"
            size={size}
            disabled={disabled}
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
          >
            button
          </Button>
          <Button
            colorType="secondary"
            variant="outlined"
            size={size}
            disabled={disabled}
          >
            button
          </Button>
          <Button
            colorType="secondary"
            variant="text"
            size={size}
            disabled={disabled}
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
          >
            button
          </Button>
          <Button
            colorType="tertiary"
            variant="outlined"
            size={size}
            disabled={disabled}
          >
            button
          </Button>
          <Button
            colorType="tertiary"
            variant="text"
            size={size}
            disabled={disabled}
          >
            button
          </Button>
        </div>
      </div>
    );
  },
};

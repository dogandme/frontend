import type { Meta, StoryObj } from "@storybook/react";
import IconSvg from "../../assets/email.svg";
import withIcon from "./Icon";

const Icon = withIcon(IconSvg);

const meta: Meta<typeof Icon> = {
  title: "shared/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    width: {
      description: "아이콘의 너비",
      control: "number",
    },
    height: {
      description: "아이콘의 높이",
      control: "number",
    },
    fill: {
      description: "아이콘의 색상",
      control: "text",
    },
  },
  parameters: {
    docs: {
      source: {
        code: `
import IconSvg from "@/shared/assets/email.svg";
import { withIcon } from "@/shared/ui/icon";

const Icon = withIcon(IconSvg);

// width, height, fill 값을 설정하지 않을 경우, 기본값이 적용됩니다.
<Icon />

// width, height, fill 값을 설정할 경우, 해당 값이 적용됩니다.
<Icon width={48} height={48} fill="#FF0000" />
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

// todo: 아이콘 공통 컴포넌트로 바꾸기

export const Default: Story = {};

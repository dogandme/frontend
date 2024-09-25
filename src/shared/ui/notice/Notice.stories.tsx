import { StoryObj } from "@storybook/react";
import { Notice } from "./Notice";

export default {
  title: "shared/Notice",
  component: Notice,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "알림 컴포넌트 입니다.",
      },
    },
  },
};

type Story = StoryObj<typeof Notice>;

export const Default: Story = {
  argTypes: {
    title: {
      description: "알림 제목",
      type: { name: "string" },
      control: {
        type: "boolean",
      },
    },
    children: {
      description: "알림 내용",
    },
  },

  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],

  render: ({ title, children = "description" }) => {
    return <Notice title={title ? "title" : undefined}>{children}</Notice>;
  },
};

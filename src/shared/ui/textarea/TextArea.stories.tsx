import type { Meta, StoryObj } from "@storybook/react";
import TextArea from "./TextArea";

const meta: Meta<typeof TextArea> = {
  title: "shared/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "TextArea 컴포넌트는 24/08/21 기준 Text Area Field 디자인 시스템을 나타내는 컴포넌트입니다. 해당 컴포넌트는 내부에서 state를 가지고 있으며 해당 state는 textArea 컴포넌트 내의 글자수를 추적하고 제한하기 위해 사용됩니다.",
      },
    },
  },
  argTypes: {
    id: {
      description:
        "TextArea 태그에서 label의 htmlFor , textarea 태그의 id,name으로 사용됩니다.",
    },
    label: {
      control: {
        type: "text",
      },
      description: "해당 TextArea의 label로 사용됩니다.",
    },
    isError: {
      control: {
        type: "boolean",
      },
      description:
        "TextArea 컴포넌트에서 에러 상태를 나타냅니다. 에러 상태일 때는 error 디자인이 전체 영역에 적용됩니다.",
    },
    maxLength: {
      control: {
        type: "number",
      },
      description:
        "TextArea 컴포넌트에서 입력 가능한 최대 글자수를 나타냅니다. 기본 값은 150입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TextArea>;
export const Default: Story = {
  args: {
    id: "textArea",
    label: "TextArea",
    isError: false,
    maxLength: 150,
  },
  render: (args) => (
    <div className="w-[328px]">
      <TextArea {...args} />
    </div>
  ),
};

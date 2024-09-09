import { within, userEvent, expect } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./TextArea";

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
    disabled: {
      control: {
        type: "boolean",
      },
      description:
        "textArea 태그의 disabled와 textArea 엘리먼트를 감싸고 있는 wrapper태그에서 disabled 스타일을 적용하기 위해 사용되는 값입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TextArea>;
export const Default: Story = {
  args: {
    id: "textArea",
    isError: false,
    maxLength: 150,
    placeholder: "Placeholder",
  },
  render: (args) => (
    <div className="flex flex-col gap-10 px-2 py-4">
      <div className="border border-grey-300 px-4 py-2">
        <h1>Default TextArea</h1>
        <div className="flex gap-10">
          <TextArea {...args} />
          <TextArea {...args} label="Title" />

          <TextArea
            {...args}
            label="Title"
            statusText="올바른 이메일을 입력해주세요"
          />
        </div>
      </div>
      <div className="border border-grey-300 px-4 py-2">
        <h1>Disabled TextArea</h1>
        <div className="flex gap-10">
          <TextArea {...args} disabled />
          <TextArea {...args} disabled label="Title" />
          <TextArea
            {...args}
            disabled
            label="Title"
            statusText="올바른 이메일을 입력해주세요"
          />
        </div>
      </div>
      <div className="border border-grey-300 px-4 py-2">
        <h1>error TextArea</h1>
        <div className="flex gap-10">
          <TextArea {...args} isError />
          <TextArea {...args} isError label="Title" />
          <TextArea
            {...args}
            statusText="올바른 이메일을 입력해주세요"
            label="Title"
            isError
          />
        </div>
      </div>
    </div>
  ),
};

export const TextAreaWithoutLabel: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => (
    <div className="flex gap-10">
      <div className="w-[300px] border border-grey-300 px-2 py-2">
        <TextArea {...args} />
      </div>
      <div className="w-[300px] border border-grey-300 px-2 py-2">
        <TextArea {...args} label="Title" essential />
      </div>
    </div>
  ),
};

export const WhenTextAreaFocused: Story = {
  args: {
    ...Default.args,
    statusText: "올바른 이메일을 입력해주세요",
  },

  render: (args) => {
    return (
      <div className="flex gap-10">
        <div className="w-[300px] border border-grey-300 px-2 py-2">
          <TextArea
            {...args}
            label="Title"
            essential
            // 더 극적인 상황을 위해 onFocus , onBlur 이벤트를 추가합니다.
            onFocus={() => console.log("onFocus")}
            onBlur={() => console.log("onBlur")}
          />
        </div>
      </div>
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 테스트에 필요한 엘리먼트들을 가져옵니다
    const $textArea = canvas.getByRole("textbox");
    const $p = canvasElement.querySelectorAll("p")?.[1];
    const p_originalHeight = $p?.clientHeight;
    const p_originalTextContent = $p?.textContent;

    const statusText = "올바른 이메일을 입력해주세요";

    // 아무런 이벤트가 발생하지 않더라도 p 태그는 존재해야 한다.
    expect($p).toBeInTheDocument();

    await userEvent.click($textArea);
    expect($p?.textContent).toBe(statusText);
    expect($p?.clientHeight).toBe(p_originalHeight);

    await userEvent.click(document.body);
    expect($p?.textContent).toBe(p_originalTextContent);
  },
};

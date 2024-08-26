import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";
import { Input, InputProps } from "./Input";
import { useState } from "react";
import { useDebounce } from "@/shared/lib";

/*----------leadingIcon, trailingIcon 등에 들어갈 svg 컴포넌트 ---------- */
const SearchIcon = () => (
  <svg
    width="1.5rem"
    height="1.5rem"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.76 13.27L20.49 19L19 20.49L13.27 14.76C12.2 15.53 10.91 16 9.5 16C5.91 16 3 13.09 3 9.5C3 5.91 5.91 3 9.5 3C13.09 3 16 5.91 16 9.5C16 10.91 15.53 12.2 14.76 13.27ZM9.5 5C7.01 5 5 7.01 5 9.5C5 11.99 7.01 14 9.5 14C11.99 14 14 11.99 14 9.5C14 7.01 11.99 5 9.5 5Z"
      fill="#9E9E9E"
    />
  </svg>
);

const MockUpIcon = () => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 20.7207C2 21.8253 2.89543 22.7207 4 22.7207H20C21.1046 22.7207 22 21.8253 22 20.7207V4.7207C22 3.61613 21.1046 2.7207 20 2.7207H4C2.89543 2.7207 2 3.61613 2 4.7207V20.7207Z"
      fill="#9E9E9E"
    />
  </svg>
);

/*----------countArea 에 들어갈 React.ReactNode 컴포넌트 ---------- */
const CountArea = () => <span className="body-2 text-grey-700">00:00</span>;

const meta: Meta<typeof Input> = {
  title: "shared/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "",
      },
    },
  },
  argTypes: {
    id: {
      description:
        "Input 태그에서 label의 htmlFor , input 태그의 id,name으로 사용됩니다.",
    },
    label: {
      control: {
        type: "text",
      },
      description: "해당 Input의 label로 사용됩니다.",
    },
    componentType: {
      control: {
        type: "select",
        options: [
          "searchText",
          "outlinedText",
          "text",
          "timerText",
          "calender",
        ],
      },
      description:
        "Input 컴포넌트의 디자인 타입을 결정합니다. 모든 디자인 타입은 사전에 정의된 디자인 시스템을 따릅니다.",
    },
    essential: {
      control: {
        type: "boolean",
      },
      description:
        "Input 컴포넌트에서 필수 입력값을 나타냅니다. 필수 입력값일 때는 label 옆에 dot이 표시됩니다.",
    },
    isError: {
      control: {
        type: "boolean",
      },
      description:
        "Input 컴포넌트에서 에러 상태를 나타냅니다. 에러 상태일 때는 error 디자인이 전체 영역과 statusText에 적용됩니다.",
    },
    statusText: {
      control: {
        type: "text",
      },
      description:
        "Input 컴포넌트에서 다양한 상황을 나타내는 텍스트입니다. 만약 statusText를 props로 전달하지 않을 시 statusText가 존재하는 영역은 렌더링 되지 않습니다.",
    },
    leadingNode: {
      description:
        "input 엘리먼트 좌측에 존재 할 수 있는 ReactNode입니다. leadingNode는 최대 하나의 노드만 가질 수 있습니다.",
    },
    trailingNode: {
      description:
        "input 엘리먼트 우측에 존재 할 수 있는 ReactNode입니다. trailingNode는 최대 두개의 노드만 가질 수 있습니다.",
    },
    disabled: {
      control: {
        type: "boolean",
      },
      description:
        "input 태그의 disabled와 input 엘리먼트를 감싸고 있는 wrapper태그에서 disabled 스타일을 적용하기 위해 사용되는 값입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    id: "input",
    // label: "Title",
    isError: false,
    placeholder: "PlaceHolder",
    essential: true,
  },
  parameters: {
    docs: {
      description: {
        story: "컴포넌트 타입에 따른 Input 컴포넌트들의 예시입니다.",
      },
    },
  },
  render: (args) => {
    return (
      <div className="flex gap-20">
        <div className="flex flex-col gap-3">
          <h1>default</h1>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="calender"
              componentType="calender"
              type="date"
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input {...args} componentType="searchText" label="searchText" />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="outlinedText"
              label="outlinedText"
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4">
            <Input {...args} componentType="text" label="text" />
          </div>
          <div className="w-[328px] border border-grey-200 p-4">
            <Input {...args} componentType="timerText" label="timerText" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h1>error</h1>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="calender"
              label="calender"
              type="date"
              isError
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="searchText"
              label="searchText"
              isError
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="outlinedText"
              label="outlinedText"
              isError
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input {...args} componentType="text" label="text" isError />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="timerText"
              label="timerText"
              isError
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h1>default when disabled</h1>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="calender"
              componentType="calender"
              type="date"
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="searchText"
              label="searchText"
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="outlinedText"
              label="outlinedText"
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="text"
              label="text"
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="timerText"
              label="timerText"
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h1>error when disabled</h1>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="calender"
              label="calender"
              type="date"
              isError
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="searchText"
              label="searchText"
              isError
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="outlinedText"
              label="outlinedText"
              isError
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="text"
              label="text"
              isError
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="timerText"
              label="timerText"
              isError
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h1>default with statusText</h1>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="calender"
              componentType="calender"
              type="date"
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="searchText"
              label="searchText"
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="outlinedText"
              label="outlinedText"
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="text"
              label="text"
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="timerText"
              label="timerText"
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h1>error with statusText</h1>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="calender"
              label="calender"
              type="date"
              isError
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="searchText"
              label="searchText"
              isError
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="outlinedText"
              label="outlinedText"
              isError
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="text"
              label="text"
              isError
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="timerText"
              label="timerText"
              isError
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
        </div>
      </div>
    );
  },
};

export const InputWithIcons: Story = {
  args: Default.args,
  parameters: {
    ...Default.parameters,
    docs: {
      description: {
        story:
          "모든 Input 아이콘들은 trailingNode, leadingNode을 포함하여 생성 될 수 있습니다.",
      },
    },
  },

  render: (args) => {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex gap-5">
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="calender"
              componentType="calender"
              type="date"
              leadingNode={<MockUpIcon />}
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="calender"
              componentType="calender"
              type="date"
              leadingNode={<MockUpIcon />}
              trailingNode={<MockUpIcon />}
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="calender"
              componentType="calender"
              type="date"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
            />
          </div>
        </div>

        <div className="flex gap-5">
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="searchText"
              componentType="searchText"
              leadingNode={<MockUpIcon />}
            />
          </div>

          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="searchText"
              componentType="searchText"
              leadingNode={<MockUpIcon />}
              trailingNode={<MockUpIcon />}
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="searchText"
              componentType="searchText"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
            />
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="outlinedText"
              componentType="outlinedText"
              leadingNode={<MockUpIcon />}
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="outlinedText"
              componentType="outlinedText"
              leadingNode={<MockUpIcon />}
              trailingNode={<MockUpIcon />}
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="outlinedText"
              componentType="outlinedText"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
            />
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="text"
              componentType="text"
              leadingNode={<MockUpIcon />}
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="text"
              componentType="text"
              leadingNode={<MockUpIcon />}
              trailingNode={<MockUpIcon />}
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="text"
              componentType="text"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
            />
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="timerText"
              componentType="timerText"
              leadingNode={<MockUpIcon />}
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="timerText"
              componentType="timerText"
              leadingNode={<MockUpIcon />}
              trailingNode={<MockUpIcon />}
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="timerText"
              componentType="timerText"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
            />
          </div>
        </div>
      </div>
    );
  },
};

export const InputExample: Story = {
  args: {
    ...Default.args,
    statusText: "올바른 입력값을 입력해주세요",
  },
  parameters: {
    ...Default.parameters,
    docs: {
      description: {
        story:
          "Input 컴포넌트로 생성된 다양한 디자인 시스템의 예시를 살펴 볼 수 있습니다.",
      },
    },
  },

  render: (args) => {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex gap-10">
          <div className="w-[328px] border border-grey-200 p-4">
            <Input
              {...args}
              label="default searchText"
              componentType="searchText"
              leadingNode={<SearchIcon />}
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4">
            <Input
              {...args}
              label="disabled searchText "
              componentType="searchText"
              leadingNode={<SearchIcon />}
              disabled
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4">
            <Input
              {...args}
              label="searchText on error"
              componentType="searchText"
              leadingNode={<SearchIcon />}
              isError
            />
          </div>
        </div>

        <div className="flex gap-10">
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="default outlinedText"
              componentType="outlinedText"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="disabled outlinedText"
              componentType="outlinedText"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
              disabled
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="outlinedText on error"
              componentType="outlinedText"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
              isError
            />
          </div>
        </div>

        <div className="flex gap-10">
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="default text"
              componentType="text"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="disabled text"
              componentType="text"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
              disabled
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="text on error"
              componentType="text"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
              isError
            />
          </div>
        </div>

        <div className="flex gap-10">
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="default timerText"
              componentType="timerText"
              trailingNode={[<CountArea />, <MockUpIcon />]}
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="disabled timerText"
              componentType="timerText"
              trailingNode={[<CountArea />, <MockUpIcon />]}
              disabled
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="timerText on error"
              componentType="timerText"
              trailingNode={[<CountArea />, <MockUpIcon />]}
              isError
            />
          </div>
        </div>

        <div className="flex gap-10">
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="default calender"
              componentType="calender"
              type="date"
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="disabled calender"
              componentType="calender"
              type="date"
              disabled
            />
          </div>
          <div className="w-[328px] border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="calender on error"
              componentType="calender"
              type="date"
              isError
            />
          </div>
        </div>
      </div>
    );
  },
};

export const StatusText: Story = {
  args: {
    ...Default.args,
    componentType: "outlinedText",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Input 컴포넌트는 statusText가 문자열일 경우엔 layout shift 현상을 방지하기 위해 항상 같은 높이를 유지합니다.",
      },
    },
  },

  render: (args) => {
    return (
      <div>
        <div className="flex gap-10 px-2 py-2">
          <div className="h-fit w-96 border border-grey-300 px-2 py-2">
            <p>status text = ""</p>
            <Input {...args} statusText="" />
          </div>
          <div className="h-fit w-96 border border-grey-300 px-2 py-2">
            <p>status text = "올바른 이메일을 입력해주세요"</p>
            <Input {...args} statusText="올바른 이메일을 입력해주세요" />
          </div>
          <div className="h-fit w-96 border border-grey-300 px-2 py-2">
            <p>status text = undefined</p>
            <Input {...args} />
          </div>
          <div className="h-fit w-96 border border-grey-300 px-2 py-2">
            <p>status text = width보다 긴 경우</p>
            <Input
              {...args}
              statusText="width 보다 긴 텍스트의 경우에는 불가피하게 layout shift를 발생 시킵니다.UX 향상을 위해 statusText에 사용될 문자열의 길이를 주의해주세요"
            />
          </div>
        </div>
      </div>
    );
  },
};

export const Essential: Story = {
  args: {
    ...Default.args,
    componentType: "outlinedText",
    label: "Title",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Input 컴포넌트는 필수 입력값을 나타내기 위해 essential props를 사용할 수 있습니다.",
      },
    },
  },
  render: (args) => {
    return (
      <div className="flex gap-10">
        <div className="border border-grey-300 px-2 py-2">
          <Input {...args} />
        </div>
        <div className="border border-grey-300 px-2 py-2">
          <Input {...args} essential={false} />
        </div>
      </div>
    );
  },
};

export const WithoutLabel: Story = {
  args: {
    ...Default.args,
    componentType: "outlinedText",
  },
  render: (args) => {
    return (
      <div className="flex gap-10">
        <div className="h-fit border border-grey-300 px-2 py-2">
          <Input {...args} label="label" />
        </div>
        <div className="h-fit border border-grey-300 px-2 py-2">
          <Input {...args} />
        </div>
      </div>
    );
  },
};

export const WhenInputFocused: Story = {
  args: {
    ...Default.args,
    componentType: "outlinedText",
    label: "Title",
    trailingNode: <MockUpIcon />,
    statusText: "올바른 이메일을 입력해주세요",
  },

  render: (args) => {
    return (
      <div className="flex gap-10">
        <div className="border border-grey-300 px-2 py-2">
          <Input
            {...args}
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
    const $input = canvas.getByRole("textbox");
    const $p = canvas.getByRole("status", { name: "status-text" });
    const p_originalHeight = $p?.clientHeight;
    const p_originalTextContent = $p?.textContent;

    const statusText = "올바른 이메일을 입력해주세요";

    // 아무런 이벤트가 발생하지 않더라도 p 태그는 존재해야 한다.
    expect($p).toBeInTheDocument();

    await userEvent.click($input);
    expect($p?.textContent).toBe(statusText);
    expect($p?.clientHeight).toBe(p_originalHeight);

    await userEvent.click(document.body);
    expect($p?.textContent).toBe(p_originalTextContent);
  },
};

const InputWithDebounceComponent = (args: InputProps) => {
  const [text, setText] = useState<string>("");

  const validateText = () => {
    if (text.length < 5) {
      return { isError: true, statusText: "5글자 이상 입력해주세요" };
    }
    return {
      isError: false,
      statusText: `현재 글자 수는 ${text.length}개 입니다.`,
    };
  };

  const { isError, statusText } = useDebounce(validateText, {
    isError: true,
    statusText: "5글자 이상 입력해주세요",
  });

  return (
    <div className="flex gap-10">
      <div className="border border-grey-300 px-2 py-2">
        <Input
          {...args}
          value={text}
          onChange={(e) => setText(e.target.value)}
          // debounce 함수를 사용하여 입력값이 변경될 때마다 콘솔에 입력값을 출력합니다.
          isError={isError}
          statusText={statusText}
        />
      </div>
    </div>
  );
};

export const InputWithDebounce: Story = {
  args: {
    ...Default.args,
    componentType: "outlinedText",
    label: "Title",
    trailingNode: <MockUpIcon />,
  },
  render: (args) => <InputWithDebounceComponent {...args} />,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const $input = canvas.getByRole("textbox");
    const $p = canvas.getByRole("status", { name: "status-text" });

    const errorStatusText = "5글자 이상 입력해주세요";
    const successStatusText = (text: string) =>
      `현재 글자 수는 ${text.length}개 입니다.`;

    const DELAY = 500;
    const DELTA = 100; // 실행 환경을 고려하여 딜레이를 조정합니다.

    // 기본적으로 p 태그는 존재해야 한다.
    expect($p).toBeInTheDocument();
    expect($p).toHaveTextContent(errorStatusText);

    // 유저가 값을 입력 했을 때 디바운스로 인해 statusText가 변경되는 것을 확인합니다.
    await userEvent.type($input, "1234567");
    expect($p).toHaveTextContent(errorStatusText);
    await new Promise((resolve) => setTimeout(resolve, DELAY + DELTA));
    expect($p).toHaveTextContent(successStatusText("1234567"));

    // 유저가 값을 제거 했을 때에도 statusText가 변경되는 것을 확인합니다.
    await userEvent.type($input, "{backspace}{backspace}{backspace}");
    expect($p).toHaveTextContent(successStatusText("1234567"));
    await new Promise((resolve) => setTimeout(resolve, DELAY + DELTA));
    expect($p).toHaveTextContent(errorStatusText);
  },
};

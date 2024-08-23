import { userEvent, within } from "@storybook/testing-library";
import type { Meta, StoryObj } from "@storybook/react";
import Input from "./Input";

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
    label: "Title",
    isError: false,
    statusText: null,
    placeholder: "PlaceHolder",
    essential: true,
  },
  parameters: {
    backgrond: {
      default: "twitter",
    },
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
          "Input 컴포넌트는 statusText가 null이 아닐 경우엔 statusText 상태와 상관 없이 항상 같은 높이를 유지합니다.",
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
            <p>status text = undefineded (null)</p>
            <Input {...args} />
          </div>
        </div>

        <div className="flex gap-10 px-2 py-2">
          <div className="h-fit w-96 border border-grey-300 px-2 py-2">
            <Input {...args} statusText="" isError />
          </div>
          <div className="h-fit w-96 border border-grey-300 px-2 py-2">
            <Input
              {...args}
              statusText="올바른 이메일을 입력해주세요"
              isError
            />
          </div>
          <div className="h-fit w-96 border border-grey-300 px-2 py-2">
            <Input {...args} statusText={null} isError />
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

import type { Meta, StoryObj } from "@storybook/react";
import Input from "./Input";

/*----------leadingIcon, trailingIcon 등에 들어갈 svg 컴포넌트 ---------- */
const CalenderIcon = () => (
  <svg
    width="1.5rem"
    height="1.5rem"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_319_15660)">
      <path
        d="M5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6C3 5.45 3.19583 4.97917 3.5875 4.5875C3.97917 4.19583 4.45 4 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.0208 4.19583 20.4125 4.5875C20.8042 4.97917 21 5.45 21 6V20C21 20.55 20.8042 21.0208 20.4125 21.4125C20.0208 21.8042 19.55 22 19 22H5ZM5 20H19V10H5V20ZM5 8H19V6H5V8ZM12 14C11.7167 14 11.4792 13.9042 11.2875 13.7125C11.0958 13.5208 11 13.2833 11 13C11 12.7167 11.0958 12.4792 11.2875 12.2875C11.4792 12.0958 11.7167 12 12 12C12.2833 12 12.5208 12.0958 12.7125 12.2875C12.9042 12.4792 13 12.7167 13 13C13 13.2833 12.9042 13.5208 12.7125 13.7125C12.5208 13.9042 12.2833 14 12 14ZM8 14C7.71667 14 7.47917 13.9042 7.2875 13.7125C7.09583 13.5208 7 13.2833 7 13C7 12.7167 7.09583 12.4792 7.2875 12.2875C7.47917 12.0958 7.71667 12 8 12C8.28333 12 8.52083 12.0958 8.7125 12.2875C8.90417 12.4792 9 12.7167 9 13C9 13.2833 8.90417 13.5208 8.7125 13.7125C8.52083 13.9042 8.28333 14 8 14ZM16 14C15.7167 14 15.4792 13.9042 15.2875 13.7125C15.0958 13.5208 15 13.2833 15 13C15 12.7167 15.0958 12.4792 15.2875 12.2875C15.4792 12.0958 15.7167 12 16 12C16.2833 12 16.5208 12.0958 16.7125 12.2875C16.9042 12.4792 17 12.7167 17 13C17 13.2833 16.9042 13.5208 16.7125 13.7125C16.5208 13.9042 16.2833 14 16 14ZM12 18C11.7167 18 11.4792 17.9042 11.2875 17.7125C11.0958 17.5208 11 17.2833 11 17C11 16.7167 11.0958 16.4792 11.2875 16.2875C11.4792 16.0958 11.7167 16 12 16C12.2833 16 12.5208 16.0958 12.7125 16.2875C12.9042 16.4792 13 16.7167 13 17C13 17.2833 12.9042 17.5208 12.7125 17.7125C12.5208 17.9042 12.2833 18 12 18ZM8 18C7.71667 18 7.47917 17.9042 7.2875 17.7125C7.09583 17.5208 7 17.2833 7 17C7 16.7167 7.09583 16.4792 7.2875 16.2875C7.47917 16.0958 7.71667 16 8 16C8.28333 16 8.52083 16.0958 8.7125 16.2875C8.90417 16.4792 9 16.7167 9 17C9 17.2833 8.90417 17.5208 8.7125 17.7125C8.52083 17.9042 8.28333 18 8 18ZM16 18C15.7167 18 15.4792 17.9042 15.2875 17.7125C15.0958 17.5208 15 17.2833 15 17C15 16.7167 15.0958 16.4792 15.2875 16.2875C15.4792 16.0958 15.7167 16 16 16C16.2833 16 16.5208 16.0958 16.7125 16.2875C16.9042 16.4792 17 16.7167 17 17C17 17.2833 16.9042 17.5208 16.7125 17.7125C16.5208 17.9042 16.2833 18 16 18Z"
        fill="#9E9E9E"
      />
    </g>
    <defs>
      <clipPath id="clip0_319_15660">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

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
          "calander",
        ],
      },
      description:
        "Input 컴포넌트의 디자인 타입을 결정합니다. 모든 디자인 타입은 사전에 정의된 디자인 시스템을 따릅니다.",
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
          <div className="border border-grey-200 p-4 px-2">
            <Input {...args} label="calander" componentType="calander" />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input {...args} componentType="searchText" label="searchText" />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="outlinedText"
              label="outlinedText"
            />
          </div>
          <div className="border border-grey-200 p-4">
            <Input {...args} componentType="text" label="text" />
          </div>
          <div className="border border-grey-200 p-4">
            <Input {...args} componentType="timerText" label="timerText" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h1>error</h1>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="calander"
              label="calander"
              isError
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="searchText"
              label="searchText"
              isError
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="outlinedText"
              label="outlinedText"
              isError
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input {...args} componentType="text" label="text" isError />
          </div>
          <div className="border border-grey-200 p-4 px-2">
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
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="calander"
              componentType="calander"
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="searchText"
              label="searchText"
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="outlinedText"
              label="outlinedText"
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="text"
              label="text"
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
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
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="calander"
              label="calander"
              isError
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="searchText"
              label="searchText"
              isError
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="outlinedText"
              label="outlinedText"
              isError
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="text"
              label="text"
              isError
              statusText="올바른 입력값을 입력해주세요"
              disabled
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
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
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="calander"
              componentType="calander"
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="searchText"
              label="searchText"
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="outlinedText"
              label="outlinedText"
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="text"
              label="text"
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
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
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="calander"
              label="calander"
              isError
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="searchText"
              label="searchText"
              isError
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="outlinedText"
              label="outlinedText"
              isError
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              componentType="text"
              label="text"
              isError
              statusText="올바른 입력값을 입력해주세요"
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
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
          <Input
            {...args}
            label="calander"
            componentType="calander"
            leadingNode={<MockUpIcon />}
          />
          <Input
            {...args}
            label="calander"
            componentType="calander"
            leadingNode={<MockUpIcon />}
            trailingNode={<MockUpIcon />}
          />
          <Input
            {...args}
            label="calander"
            componentType="calander"
            leadingNode={<MockUpIcon />}
            trailingNode={[<MockUpIcon />, <MockUpIcon />]}
          />
        </div>
        <div className="flex gap-5">
          <Input
            {...args}
            label="searchText"
            componentType="searchText"
            leadingNode={<MockUpIcon />}
          />
          <Input
            {...args}
            label="searchText"
            componentType="searchText"
            leadingNode={<MockUpIcon />}
            trailingNode={<MockUpIcon />}
          />
          <Input
            {...args}
            label="searchText"
            componentType="searchText"
            leadingNode={<MockUpIcon />}
            trailingNode={[<MockUpIcon />, <MockUpIcon />]}
          />
        </div>
        <div className="flex gap-5">
          <Input
            {...args}
            label="outlinedText"
            componentType="outlinedText"
            leadingNode={<MockUpIcon />}
          />
          <Input
            {...args}
            label="outlinedText"
            componentType="outlinedText"
            leadingNode={<MockUpIcon />}
            trailingNode={<MockUpIcon />}
          />
          <Input
            {...args}
            label="outlinedText"
            componentType="outlinedText"
            leadingNode={<MockUpIcon />}
            trailingNode={[<MockUpIcon />, <MockUpIcon />]}
          />
        </div>
        <div className="flex gap-5">
          <Input
            {...args}
            label="text"
            componentType="text"
            leadingNode={<MockUpIcon />}
          />
          <Input
            {...args}
            label="text"
            componentType="text"
            leadingNode={<MockUpIcon />}
            trailingNode={<MockUpIcon />}
          />
          <Input
            {...args}
            label="text"
            componentType="text"
            leadingNode={<MockUpIcon />}
            trailingNode={[<MockUpIcon />, <MockUpIcon />]}
          />
        </div>
        <div className="flex gap-5">
          <Input
            {...args}
            label="timerText"
            componentType="timerText"
            leadingNode={<MockUpIcon />}
          />
          <Input
            {...args}
            label="timerText"
            componentType="timerText"
            leadingNode={<MockUpIcon />}
            trailingNode={<MockUpIcon />}
          />
          <Input
            {...args}
            label="timerText"
            componentType="timerText"
            leadingNode={<MockUpIcon />}
            trailingNode={[<MockUpIcon />, <MockUpIcon />]}
          />
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
          <div className="border border-grey-200 p-4">
            <Input
              {...args}
              label="default searchText"
              componentType="searchText"
              leadingNode={<SearchIcon />}
            />
          </div>
          <div className="border border-grey-200 p-4">
            <Input
              {...args}
              label="disabled searchText "
              componentType="searchText"
              leadingNode={<SearchIcon />}
              disabled
            />
          </div>
          <div className="border border-grey-200 p-4">
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
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="default outlinedText"
              componentType="outlinedText"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="disabled outlinedText"
              componentType="outlinedText"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
              disabled
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
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
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="default text"
              componentType="text"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="disabled text"
              componentType="text"
              leadingNode={<MockUpIcon />}
              trailingNode={[<MockUpIcon />, <MockUpIcon />]}
              disabled
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
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
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="default timerText"
              componentType="timerText"
              trailingNode={[<CountArea />, <MockUpIcon />]}
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="disabled timerText"
              componentType="timerText"
              trailingNode={[<CountArea />, <MockUpIcon />]}
              disabled
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
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
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="default calander"
              componentType="calander"
              trailingNode={<CalenderIcon />}
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="disabled calander"
              componentType="calander"
              trailingNode={<CalenderIcon />}
              disabled
            />
          </div>
          <div className="border border-grey-200 p-4 px-2">
            <Input
              {...args}
              label="calander on error"
              componentType="calander"
              trailingNode={<CalenderIcon />}
              isError
            />
          </div>
        </div>
      </div>
    );
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import BaseInput from "./BaseInput";
import { InputProps } from "./input.types";

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

const meta: Meta<typeof BaseInput> = {
  title: "shared/Input",
  component: BaseInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "현재 보여지는 컴포넌트는 BaseInput 입니다. designType을 이용해 다양한 디자인 시스템의 Input 태그들을 생성합니다. 생성된 Input 태그들은 다양한 props를 외부에서 주입받아 사용됩니다. 해당 BaseInput 컴포넌트는 shared 외부로 export 되지 않으며 BaseInput 으로 생성된 디자인 시스템 컴포넌트들만이 외부로 export 됩니다.",
      },
    },
  },
  argTypes: {
    title: {
      description:
        "`<label>{title}</label>`로 렌더링됩니다. 인풋 태그 상단에 존재합니다.",
      control: {
        type: "text",
      },
    },
    id: {
      description:
        "label태그의 htmlFor, input 태그의 name, id 속성에 사용됩니다.",
      control: {
        type: "text",
      },
    },
    designType: {
      description:
        "디자인 타입을 지정합니다. 해당 타입에 따라 디자인이 변경됩니다. 모든 디자인들은 enabled, focus , hover , disabled 에 대한 가상 선택자 스타일을 이용해 디자인 되었습니다.",
      options: [
        "searchTextInput",
        "outLinedTextInput",
        "textInput",
        "timerTextInput",
        "calanderInput",
        "textField",
      ],
      control: {
        type: "select",
      },
    },
    condition: {
      description:
        "해당 컴포넌트의 상태를 지정합니다. 해당 props를 통해 디자인의 모습을 변경합니다.",
      options: ["default", "error"],
      control: {
        type: "select",
      },
    },
    supportingText: {
      description:
        "인풋 태그 하단에 존재하는 보조 텍스트입니다. 외부로부터 문자를 주입 받아 사용되며 빈 문자열이더라도 문자가 존재해야 하는 영역이 렌더링 됩니다. 만약 빈 문자열이 아닌 undefined를 주입하거나 설정하지 않으면 해당 공간은 렌더링되지 않습니다.",
      control: {
        type: "text",
      },
    },
    additionalOutterStyle: {
      description:
        "인풋 태그를 감싸는 div 태그에 추가적인 스타일을 적용합니다. 외부로부터 CSSProperties를 주입받습니다.",
      control: {
        type: "object",
      },
    },
    additionalSupportingTextStyle: {
      description:
        "supportingText에 대한 추가적인 스타일을 적용합니다. 외부로부터 CSSProperties를 주입받습니다.",
      control: {
        type: "object",
      },
    },
    leadingIcon: {
      description:
        "input 태그 이전에 존재 할 아이콘입니다. React.ReactNode을 주입받습니다.",
      control: {
        type: "select",
      },
      options: ["None", "SearchIcon"],
      mapping: {
        None: undefined,
        SearchIcon: <SearchIcon />,
      },
    },
    countArea: {
      description:
        "input 태그 이후에 존재 할 카운트 영역입니다. React.ReactNode을 주입받습니다.",
      control: {
        type: "select",
      },
      options: ["None", "CountArea"],
      mapping: {
        None: undefined,
        CountArea: <CountArea />,
      },
    },
    trailingIcon: {
      description:
        "input 태그 이후에 존재 할 아이콘입니다. React.ReactNode을 주입받습니다.",
      control: {
        type: "select",
      },
      options: ["None", "CalenderIcon"],
      mapping: {
        None: undefined,
        CalenderIcon: <CalenderIcon />,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof BaseInput>;

export const Default: Story = {
  args: {
    title: "Title",
    id: "id",
    designType: "searchTextInput",
    condition: "default",
    placeholder: "placeholder",
    supportingText: "Supporting Text",
    additionalOutterStyle: {
      width: "328px",
    },
  },
  render: (args) => {
    return <BaseInput {...args} />;
  },
};

export const SearchTextInput = {
  args: {
    ...Default.args,
    designType: "searchTextInput",
    leadingIcon: <SearchIcon />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Search Text Input 입니다. 해당 태그는 supportingText와 에러 상태를 가지지 않습니다. 아이콘으론 leadingIcon 만 갖습니다.",
      },
    },
  },
};

export const TimerTextInput = {
  args: {
    ...Default.args,
    designType: "timerTextInput",
    countArea: <CountArea />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Timer Text Input 입니다. 해당 태그는 condition으로 error를 가질 수 있으며 에러 상태일 때 보이는 모습이 다릅니다. 카운트 기능이 있는 컴포넌트를 `countArea` props로 받습니다.",
      },
    },
  },
  render: (args: InputProps<"timerTextInput">) => {
    return (
      <div className="flex flex-col gap-4">
        <h1>Default</h1>
        <BaseInput {...args} />
        <h1>Error</h1>
        <BaseInput {...args} condition="error" />
      </div>
    );
  },
};

export const CalendarInput = {
  args: {
    ...Default.args,
    designType: "calanderInput",
    trailingIcon: <CalenderIcon />,
    type: "date",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Calender Input 입니다. 해당 태그는 supportingText와 에러 상태를 가질 수 있습니다. 아이콘으론 trailingIcon 만 갖습니다.",
      },
    },
  },
  render: (args: InputProps<"calanderInput">) => {
    return (
      <div className="flex flex-col gap-4">
        <h1>Default</h1>
        <BaseInput {...args} />
        <h1>Error</h1>
        <BaseInput {...args} condition="error" />
      </div>
    );
  },
};

export const TextInput = {
  args: {
    ...Default.args,
    designType: "textInput",
    leadingIcon: <MockUpIcon />,
    CountArea: <CountArea />,
    trailingIcon: <MockUpIcon />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Text Field 입니다. 해당 태그는 supportingText와 에러 상태를 가질 수 있습니다. 다양한 ReactNode를 props로 Icon으로 받아 사용 할 수 있습니다.",
      },
    },
  },
  render: (args: InputProps<"textInput">) => {
    return (
      <div className="flex flex-col gap-4">
        <h1>Default</h1>
        <BaseInput {...args} />
        <h1>Error</h1>
        <BaseInput {...args} condition="error" />
      </div>
    );
  },
};

export const OutLinedTextInput = {
  args: {
    ...Default.args,
    designType: "outLinedTextInput",
    leadingIcon: <MockUpIcon />,
    CountArea: <CountArea />,
    trailingIcon: <MockUpIcon />,
  },
  parameters: {
    docs: {
      story:
        "OutLined Text Input 입니다.supportingText와 에러 상태를 가질 수 있습니다. 다양한 ReactNode를 props로 Icon으로 받아 사용 할 수 있습니다.",
    },
  },
  render: (args: InputProps<"outLinedTextInput">) => {
    return (
      <div className="flex flex-col gap-4">
        <h1>Default</h1>
        <BaseInput {...args} />
        <h1>Error</h1>
        <BaseInput {...args} condition="error" />
      </div>
    );
  },
};

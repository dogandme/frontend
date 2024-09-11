import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { CancelIcon } from "../icon";
import { ActionChip } from "./ActionChip";

const meta: Meta<typeof ActionChip> = {
  title: "shared/ActionChip",
  component: ActionChip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "제어 컴포넌트와 비제어 컴포넌트 모두에 사용 가능한 ActionChip 컴포넌트입니다. 제어 컴포넌트의 경우엔 isSelected props 를 통해 상태를 제어 합니다. 비제어 컴포넌트의 경우엔 unControlledInitialIsSelected props 를 통해 초기 상태를 설정합니다. isSelected 와 unControlledInitialIsSelected 를 모두 사용하지 않거나 모두 사용하게 되면 타입 에러를 발생 시킵니다.",
      },
    },
  },
  argTypes: {
    variant: {
      description:
        "액션 칩의 스타일을 설정합니다. filled 와 outlined 가 있습니다.",
      control: "radio",
      options: ["filled", "outlined"],
    },
    children: {
      description: "액션 칩 내부의 label 입니다.",
      control: {
        type: "text",
      },
    },
    leadingIcon: {
      description:
        "액셥 칩 내부의 leading icon 입니다. 좌측에 존재합니다. 사용 할 땐 컴포넌트를 주입해 사용하며 스토리북에선 boolean 값으로 유무를 테스트 해볼 수 있습니다.",
      control: {
        type: "boolean",
      },
    },
    trailingIcon: {
      description:
        "액션 칩 내부의 trailing icon 입니다. 우측에 존재합니다. 사용 할 땐 컴포넌트를 주입해 사용하며 스토리북에선 boolean 값으로 유무를 테스트 해볼 수 있습니다.",
      control: {
        type: "boolean",
      },
    },
    isSelected: {
      description:
        "외부에서 주입 받는 상태값입니다. 제어 컴포넌트의 경우 사용됩니다.",
      control: {
        type: "boolean",
      },
    },
    unControlledInitialIsSelected: {
      description:
        "내부에서 사용하는 상태의 초기값입니다. 비제어 컴포넌트의 경우 사용됩니다.",
      control: {
        type: "boolean",
      },
    },
    disabled: {
      description: "액셥칩의 비활성화 여부를 설정합니다.",
      control: {
        type: "boolean",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ActionChip>;

export const UncontrolledActionChip: Story = {
  args: {
    variant: "outlined",
    leadingIcon: true,
    trailingIcon: false,
    isSelected: undefined,
    unControlledInitialIsSelected: true,
    children: "Uncontrolled Action Chip",
    disabled: false,
  },

  render: (args) => {
    const {
      variant,
      leadingIcon,
      trailingIcon,
      unControlledInitialIsSelected,
      children,
      disabled,
    } = args;

    return (
      <ActionChip
        variant={variant}
        leadingIcon={leadingIcon ? <CancelIcon /> : undefined}
        trailingIcon={trailingIcon ? <CancelIcon /> : undefined}
        unControlledInitialIsSelected={unControlledInitialIsSelected as boolean}
        disabled={disabled}
      >
        {children}
      </ActionChip>
    );
  },
};

export const ControlledActionChip: Story = {
  args: {
    variant: "outlined",
    leadingIcon: true,
    trailingIcon: false,
    isSelected: true,
    unControlledInitialIsSelected: undefined,
    children: "Uncontrolled Action Chip",
    disabled: false,
  },

  render: (args) => {
    const {
      variant,
      leadingIcon,
      trailingIcon,
      children,
      disabled,
      isSelected: _isSelected,
    } = args;

    /* eslint-disable */
    const [isSelected, setIsSelected] = useState<boolean>(
      _isSelected as boolean,
    );
    const handleClick = () => setIsSelected((prev) => !prev);

    return (
      <div>
        <p>
          ControlledActionChip 의 경우엔 외부에서 상태를 변경시키지 않는 이상
        </p>
        <p className="mb-4">액션칩 내부의 상태가 변경되지 않습니다. 🔥</p>
        <div className="flex flex-col gap-2 w-60">
          <button
            onClick={handleClick}
            className="bg-grey-200 rounded-2xl px-2 py-2"
          >
            액션칩에 주입한 isSelected 상태 변경하기
          </button>
          <ActionChip
            variant={variant}
            leadingIcon={leadingIcon ? <CancelIcon /> : undefined}
            trailingIcon={trailingIcon ? <CancelIcon /> : undefined}
            isSelected={isSelected}
            disabled={disabled}
          >
            {children}
          </ActionChip>
        </div>
      </div>
    );
  },
};

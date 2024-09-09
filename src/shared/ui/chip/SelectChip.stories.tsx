import { Meta, StoryObj } from "@storybook/react";
import { SelectChip } from "./SelectChip";
import { userEvent, within } from "@storybook/test";
import { useState } from "react";

const meta: Meta<typeof SelectChip> = {
  title: "shared/SelectChip",
  tags: ["autodocs"],
  component: SelectChip,

  parameters: {
    docs: {
      description: {
        component:
          "선택 가능한 SelectChip 컴포넌트입니다. 해당 컴포넌트는 클릭 On , Off와 유사한 상태를 가집니다. 비제어 컴포넌트와 제어 컴포넌트 모두로 사용 가능하며 제어 컴포넌트의 경우 isControlledIsSelected props와 상태 핸들러를 onClick에 전달해주면 됩니다.",
      },
    },
  },

  argTypes: {
    label: {
      description: "Chip에 표시될 라벨입니다.",
      control: {
        type: "text",
      },
    },
    controlledIsSelected: {
      description:
        "제어 컴포넌트의 경우 선택된 상태를 결정하는 props입니다. 해당 props가 존재할 경우 내부에서 상태를 업데이트 하지 않습니다.",
      control: {
        type: "boolean",
      },
    },
    onClick: {
      description:
        "버튼에 달리는 온클릭 이벤트 핸들러입니다. props로 새로운 온클릭 이벤트 핸들러가 등록 될 때 등록된 이벤트 핸들러를 실행하고 내부에 존재하는 핸들러를 추가로 실행합니다.",
    },
  },
};

export default meta;

const DefaultComponent = () => {
  const [controlledIsSelected, setControlledIsSelected] =
    useState<boolean>(false);
  const handler = () => {
    setControlledIsSelected((prev) => !prev);
  };

  return (
    <div>
      <p>부모 컴포넌트의 상태 : {String(controlledIsSelected)}</p>
      <div className="flex w-fit gap-2 border border-grey-300 px-2 py-2">
        <SelectChip label="UnControlled Chip" />
        <SelectChip
          label="Controlled Chip"
          controlledIsSelected={controlledIsSelected}
          onClick={handler}
        />
      </div>
    </div>
  );
};

export const Default: StoryObj<typeof SelectChip> = {
  render: () => <DefaultComponent />,
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const $on = canvas.getByText("Controlled Chip");
    userEvent.click($on);
  },
};

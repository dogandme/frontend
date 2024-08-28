import { Meta, StoryObj } from "@storybook/react";
import { SelectChip } from "./SelectChip";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof SelectChip> = {
  title: "shared/SelectChip",
  tags: ["autodocs"],
  component: SelectChip,

  parameters: {
    docs: {
      description: {
        component:
          "선택 가능한 SelectChip 컴포넌트입니다. 해당 컴포넌트는 클릭 On , Off와 유사한 상태를 가집니다. ",
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
    onClick: {
      description:
        "버튼에 달리는 온클릭 이벤트 핸들러입니다. props로 새로운 온클릭 이벤트 핸들러가 등록 될 때 등록된 이벤트 핸들러를 실행하고 내부에 존재하는 핸들러를 추가로 실행합니다.",
    },
  },
};

export default meta;

export const Default: StoryObj<typeof SelectChip> = {
  render: () => (
    <div className="flex w-fit gap-2 border border-grey-300 px-2 py-2">
      <SelectChip label="Chip" aria-label="on" />
      <SelectChip label="Chip" aria-label="off" />
    </div>
  ),

  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const $on = canvas.getByLabelText("on");
    userEvent.click($on);
  },
};

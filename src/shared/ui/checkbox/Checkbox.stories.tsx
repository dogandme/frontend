import type { Meta, StoryObj } from "@storybook/react";

import Checkbox from "./Checkbox";
import { useState } from "react";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof Checkbox> = {
  title: "shared/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: {
      description: "체크박스의 선택 여부입니다.",
      control: { type: "boolean" },
    },
    isIndeterminate: {
      description:
        "해당 체크박스가 선택되었는지 혹은 선택되지 않았는지 판단할 수 없는 상태를 의미합니다. (모든 체크박스가 선택되어 있지 않지만 하나 이상 선택되어 있을 경우, true로 설정)",
      control: { type: "boolean" },
    },
    gap: {
      description: "체크박스와 라벨 사이의 간격입니다.",
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {},
};

export const CheckboxWithLabel: Story = {
  render: () => {
    /* eslint-disable react-hooks/rules-of-hooks  */
    const [checked, setChecked] = useState<boolean>(false);

    return (
      <Checkbox
        id="checkbox-1"
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
        gap="0.5rem"
      >
        <span className="btn-2">라벨입니다</span>
      </Checkbox>
    );
  },
};

export const IndeterminateExample: Story = {
  render: () => {
    /* eslint-disable react-hooks/rules-of-hooks  */
    const [checkedItems, setCheckedItems] = useState<boolean[]>([
      false,
      false,
      false,
    ]);

    // 전체 선택되어 있는 경우
    const allChecked = checkedItems.every(Boolean);
    // 전체 선택되어 있지 않고 하나 이상 선택되어 있는 경우
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

    return (
      <div>
        <Checkbox
          id="checkbox-1"
          checked={allChecked}
          isIndeterminate={isIndeterminate}
          onChange={(e) =>
            setCheckedItems([
              e.target.checked,
              e.target.checked,
              e.target.checked,
            ])
          }
          gap="1rem"
        >
          <span className="btn-2">전체 동의합니다.</span>
        </Checkbox>
        <Checkbox
          id="checkbox-2"
          checked={checkedItems[0]}
          onChange={(e) =>
            setCheckedItems([
              e.target.checked,
              checkedItems[1],
              checkedItems[2],
            ])
          }
          gap="1rem"
        >
          <span className="btn-2">이용약관 동의 (필수)</span>
        </Checkbox>
        <Checkbox
          id="checkbox-3"
          checked={checkedItems[1]}
          onChange={(e) =>
            setCheckedItems([
              checkedItems[0],
              e.target.checked,
              checkedItems[2],
            ])
          }
          gap="1rem"
        >
          <span className="btn-2">개인정보 수집 및 이용 동의 (필수)</span>
        </Checkbox>
        <Checkbox
          id="checkbox-4"
          checked={checkedItems[2]}
          onChange={(e) =>
            setCheckedItems([
              checkedItems[0],
              checkedItems[1],
              e.target.checked,
            ])
          }
          gap="1rem"
        >
          <span className="btn-2">마케팅 정보 수신 동의 (선택)</span>
        </Checkbox>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const $allCheckboxes = canvas.getAllByRole("checkbox");
    const [$parentCheckbox, ...$childrenCheckboxes] = $allCheckboxes;

    await step(
      "부모 체크박스를 선택하면, 하위 체크박스들이 선택된다.",
      async () => {
        await userEvent.click($parentCheckbox);

        expect($parentCheckbox).toBeChecked();
        $childrenCheckboxes.forEach(($child) => {
          expect($child).toBeChecked();
        });
      },
    );

    await step(
      "모든 하위 체크박스가 선택된 상태에서 하나를 선택 해제하면, 부모 체크박스는 'indeterminate' 상태로 전환됩니다.",
      async () => {
        await userEvent.click($childrenCheckboxes[0]);

        expect($childrenCheckboxes[0]).not.toBeChecked();
        expect($parentCheckbox).toBePartiallyChecked();
        expect($parentCheckbox).not.toBeChecked();
      },
    );

    await step(
      "모든 하위 체크박스를 선택하면, 부모 체크박스도 선택됩니다.",
      async () => {
        await userEvent.click($childrenCheckboxes[0]);

        expect($parentCheckbox).not.toBePartiallyChecked();
        expect($parentCheckbox).toBeChecked();
      },
    );
  },
};

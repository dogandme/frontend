import type { Meta, StoryObj } from "@storybook/react";

import Select from "./Select";
import { useState } from "react";
import { ArrowDropDownIcon } from "../icon";
import { Input } from "../input";

const meta: Meta<typeof Select> = {
  title: "shared/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      description: "Select 컴포넌트의 렌더링 여부입니다.",
      control: {
        type: "boolean",
      },
    },
    onClose: {
      description: "Select 컴포넌트를 닫는 함수입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const BottomSheetSelect: Story = {
  render: () => {
    const optionList = [
      {
        value: 1,
        name: "10대",
      },
      {
        value: 2,
        name: "20~30대",
      },
      {
        value: 3,
        name: "30~40대",
      },
      {
        value: 4,
        name: "50~60대",
      },
      {
        value: 5,
        name: "60대 이상",
      },
    ];

    /* eslint-disable */
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<number | null>(null);

    const selectedName = optionList.find(
      (option) => option.value === selectedValue,
    )?.name;

    return (
      <>
        {/* select 컴포넌트를 여는 trigger */}
        <Input
          id="age"
          name="age"
          label="연령대"
          essential
          value={selectedName ?? ""}
          placeholder="연령대를 선택해 주세요"
          type="text"
          trailingNode={<ArrowDropDownIcon />}
          componentType="outlinedText"
          readOnly
          style={{ cursor: "pointer" }}
          onClick={() => setIsOpen(true)}
        />

        <Select isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Select.BottomSheet>
            <Select.OptionList>
              {optionList.map(({ value, name }) => {
                return (
                  <Select.Option
                    key={value}
                    value={value}
                    isSelected={value === selectedValue}
                    onClick={() => setSelectedValue(value)}
                  >
                    {name}
                  </Select.Option>
                );
              })}
            </Select.OptionList>
          </Select.BottomSheet>
        </Select>
      </>
    );
  },
};

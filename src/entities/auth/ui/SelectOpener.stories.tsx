import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { SelectOpener } from "./SelectOpener";
import { useState } from "react";
import { Select } from "@/shared/ui/select";
import { expect, within, fn, userEvent } from "@storybook/test";
import { Checkbox } from "@/shared/ui/checkbox";

const meta: Meta = {
  title: "entities/auth/SelectOpener",
  component: SelectOpener,
  tags: ["autodocs"],
  argTypes: {
    label: {
      description: "label을 나타냅니다.",
      control: {
        type: "text",
      },
    },
    essential: {
      description: "필수 여부를 나타냅니다.",
      control: {
        type: "boolean",
      },
    },
    placeholder: {
      description: "placeholder를 나타냅니다.",
      control: {
        type: "text",
      },
    },
    disabled: {
      description: "비활성 여부를 나타냅니다.",
      control: {
        type: "boolean",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SelectOpener>;

export const Default: Story = {
  args: {
    label: "label",
    essential: false,
    placeholder: "placeholder",
    value: "",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const $label = canvas.getByText("label");
    const $opener = canvas.getByRole("button", {
      name: /placeholder/i,
    });

    // 오프너 클릭 이벤트 핸들러 모킹
    const handleOpenerClick = fn();
    $opener.onclick = handleOpenerClick;

    await step("label을 클릭하면, button이 포커스되고 클릭된다.", async () => {
      await userEvent.click($label);

      expect($opener).toHaveFocus();
      expect(handleOpenerClick).toHaveBeenCalled();
    });
  },
};

export const Example: Story = {
  render: () => {
    const genderOptionList = [
      {
        value: "MALE",
        name: "남자",
      },
      {
        value: "FEMALE",
        name: "여자",
      },
    ] as const;

    /* eslint-disable */
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<
      "FEMALE" | "MALE" | null
    >(null);

    const selectedName = genderOptionList.find(
      (option) => option.value === selectedValue,
    )?.name;

    return (
      <div>
        <SelectOpener
          label="성별"
          essential={true}
          placeholder="성별을 선택해 주세요"
          value={selectedName ?? ""}
          disabled={false}
          onClick={() => setIsOpen(!isOpen)}
        />

        <Select isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Select.BottomSheet>
            <Select.OptionList>
              {genderOptionList.map(({ value, name }) => {
                return (
                  <Select.Option
                    key={value}
                    value={value}
                    isSelected={value === selectedValue}
                    onClick={() => {
                      setSelectedValue(value);
                    }}
                  >
                    {name}
                  </Select.Option>
                );
              })}
            </Select.OptionList>
          </Select.BottomSheet>
        </Select>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const optionList = ["가스코뉴 푸아트방", "가이아나쿠르세르"] as const;

    /* eslint-disable */
    const [isDisabled, setIsDisabled] = useState<boolean>(true);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    const selectedName = optionList.find((option) => option === selectedValue);

    return (
      <div>
        <div>
          <SelectOpener
            label="어떤 종의 아이인가요?"
            essential={true}
            placeholder="품종을 선택해 주세요"
            value={selectedName ?? ""}
            disabled={isDisabled}
            onClick={() => {
              action("onSelectOpenerClick")();
              setIsOpen(!isOpen);
            }}
          />
          <Checkbox
            checked={isDisabled}
            onChange={() => setIsDisabled((prev) => !prev)}
          >
            <span className="btn-3 text-grey-500">모르겠어요</span>
          </Checkbox>
        </div>

        <Select isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Select.BottomSheet>
            <Select.OptionList>
              {optionList.map((value) => {
                return (
                  <Select.Option
                    key={value}
                    value={value}
                    isSelected={value === selectedValue}
                    onClick={() => {
                      action("onOptionClick")(value);
                      setSelectedValue(value);
                    }}
                  >
                    {value}
                  </Select.Option>
                );
              })}
            </Select.OptionList>
          </Select.BottomSheet>
        </Select>
      </div>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const $label = canvas.getByText("어떤 종의 아이인가요?");
    const $opener = canvasElement.querySelector("button");

    await step("disabled 상태일 때, button이 비활성화된다.", async () => {
      expect($opener).toBeDisabled();
    });

    await step(
      "disabled 상태일 때 label을 클릭해도, button이 클릭되지 않는다.",
      async () => {
        // 오프너 클릭 이벤트 핸들러 모킹
        const handleOpenerClick = fn();
        $opener!.onclick = handleOpenerClick;

        await userEvent.click($label);

        expect($opener).not.toHaveFocus();
        expect(handleOpenerClick).not.toHaveBeenCalled();
      },
    );
  },
};

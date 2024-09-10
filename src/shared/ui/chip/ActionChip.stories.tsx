import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { CancelIcon } from "../icon";
import { ActionChip } from "./ActionChip";

const meta: Meta<typeof ActionChip> = {
  title: "shared/ActionChip",
  component: ActionChip,
};

export default meta;

type Story = StoryObj<typeof ActionChip>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="px-2 py-2 flex flex-col gap-2">
        <Story />
      </div>
    ),
  ],
  render: () => {
    /*eslint-disable*/
    const [isSelected, setIsSelected] = useState<boolean>(true);
    const handleClick = () => setIsSelected((prev) => !prev);

    return (
      <>
        <div>
          <h1>제어 컴포넌트</h1>
          <p>외부 상태 : {isSelected ? "selected" : "unSelected"}</p>
          <div className="flex gap-2 px-2 py-2 bg-grey-200 flex-wrap w-fit">
            <ActionChip
              variant="filled"
              isSelected={isSelected}
              onClick={handleClick}
            >
              Filled
            </ActionChip>
            <ActionChip
              variant="filled"
              leadingIcon={<CancelIcon width={20} height={20} />}
              isSelected={isSelected}
              onClick={handleClick}
            >
              Filled
            </ActionChip>
            <ActionChip
              variant="filled"
              trailingIcon={<CancelIcon width={20} height={20} />}
              isSelected={isSelected}
              onClick={handleClick}
            >
              Filled
            </ActionChip>
            <ActionChip
              variant="filled"
              leadingIcon={<CancelIcon width={20} height={20} />}
              trailingIcon={<CancelIcon width={20} height={20} />}
              isSelected={isSelected}
              onClick={handleClick}
            >
              Filled
            </ActionChip>
            <ActionChip
              variant="filled"
              leadingIcon={<CancelIcon width={20} height={20} />}
              trailingIcon={<CancelIcon width={20} height={20} />}
              isSelected={isSelected}
              onClick={handleClick}
              disabled
            >
              Filled
            </ActionChip>
          </div>
          <div className="flex gap-2 px-2 py-2 bg-grey-200 flex-wrap w-fit">
            <ActionChip
              variant="outlined"
              isSelected={isSelected}
              onClick={handleClick}
            >
              Filled
            </ActionChip>
            <ActionChip
              variant="outlined"
              leadingIcon={<CancelIcon width={20} height={20} />}
              isSelected={isSelected}
              onClick={handleClick}
            >
              Filled
            </ActionChip>
            <ActionChip
              variant="outlined"
              trailingIcon={<CancelIcon width={20} height={20} />}
              isSelected={isSelected}
              onClick={handleClick}
            >
              Filled
            </ActionChip>
            <ActionChip
              variant="outlined"
              leadingIcon={<CancelIcon width={20} height={20} />}
              trailingIcon={<CancelIcon width={20} height={20} />}
              isSelected={isSelected}
              onClick={handleClick}
            >
              Filled
            </ActionChip>
            <ActionChip
              variant="outlined"
              leadingIcon={<CancelIcon width={20} height={20} />}
              trailingIcon={<CancelIcon width={20} height={20} />}
              isSelected={isSelected}
              onClick={handleClick}
              disabled
            >
              Filled
            </ActionChip>
          </div>
        </div>
        <div>
          <div>
            <h1>비제어 컴포넌트</h1>
            <div className="flex gap-2 px-2 py-2 bg-grey-200 flex-wrap w-fit">
              <div className="flex gap-2 px-2 py-2 bg-grey-200 flex-wrap w-fit">
                <ActionChip variant="filled" isSelected={true} isUncontrolled>
                  Filled
                </ActionChip>
                <ActionChip
                  variant="filled"
                  leadingIcon={<CancelIcon width={20} height={20} />}
                  isSelected={true}
                  isUncontrolled
                >
                  Filled
                </ActionChip>
                <ActionChip
                  variant="filled"
                  trailingIcon={<CancelIcon width={20} height={20} />}
                  isSelected={true}
                  isUncontrolled
                >
                  Filled
                </ActionChip>
                <ActionChip
                  variant="filled"
                  leadingIcon={<CancelIcon width={20} height={20} />}
                  trailingIcon={<CancelIcon width={20} height={20} />}
                  isSelected={true}
                  isUncontrolled
                >
                  Filled
                </ActionChip>
                <ActionChip
                  variant="filled"
                  leadingIcon={<CancelIcon width={20} height={20} />}
                  trailingIcon={<CancelIcon width={20} height={20} />}
                  isSelected={true}
                  isUncontrolled
                  disabled
                >
                  Filled
                </ActionChip>
              </div>
              <div className="flex gap-2 px-2 py-2 bg-grey-200 flex-wrap w-fit">
                <ActionChip variant="outlined" isSelected={true}>
                  Filled
                </ActionChip>
                <ActionChip
                  variant="outlined"
                  leadingIcon={<CancelIcon width={20} height={20} />}
                  isSelected={true}
                  isUncontrolled
                >
                  Filled
                </ActionChip>
                <ActionChip
                  variant="outlined"
                  trailingIcon={<CancelIcon width={20} height={20} />}
                  isSelected={true}
                  isUncontrolled
                >
                  Filled
                </ActionChip>
                <ActionChip
                  variant="outlined"
                  leadingIcon={<CancelIcon width={20} height={20} />}
                  trailingIcon={<CancelIcon width={20} height={20} />}
                  isSelected={true}
                  isUncontrolled
                >
                  Filled
                </ActionChip>
                <ActionChip
                  variant="outlined"
                  leadingIcon={<CancelIcon width={20} height={20} />}
                  trailingIcon={<CancelIcon width={20} height={20} />}
                  isSelected={true}
                  isUncontrolled
                  disabled
                >
                  Filled
                </ActionChip>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
};

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
              label="Filled"
              controlledIsSelected={isSelected}
              onClick={handleClick}
            />
            <ActionChip
              variant="filled"
              leadingIcon={<CancelIcon width={20} height={20} />}
              label="Filled"
              controlledIsSelected={isSelected}
              onClick={handleClick}
            />
            <ActionChip
              variant="filled"
              trailingIcon={<CancelIcon width={20} height={20} />}
              label="Filled"
              controlledIsSelected={isSelected}
              onClick={handleClick}
            />
            <ActionChip
              variant="filled"
              label="Filled"
              leadingIcon={<CancelIcon width={20} height={20} />}
              trailingIcon={<CancelIcon width={20} height={20} />}
              controlledIsSelected={isSelected}
              onClick={handleClick}
            />
            <ActionChip
              variant="filled"
              label="Filled"
              leadingIcon={<CancelIcon width={20} height={20} />}
              trailingIcon={<CancelIcon width={20} height={20} />}
              controlledIsSelected={isSelected}
              onClick={handleClick}
              disabled
            />
          </div>
          <div className="flex gap-2 px-2 py-2 bg-grey-200 flex-wrap w-fit">
            <ActionChip
              variant="outlined"
              label="outlined"
              controlledIsSelected={isSelected}
              onClick={handleClick}
            />
            <ActionChip
              variant="outlined"
              leadingIcon={<CancelIcon width={20} height={20} />}
              label="outlined"
              controlledIsSelected={isSelected}
              onClick={handleClick}
            />
            <ActionChip
              variant="outlined"
              trailingIcon={<CancelIcon width={20} height={20} />}
              label="outlined"
              controlledIsSelected={isSelected}
              onClick={handleClick}
            />
            <ActionChip
              variant="outlined"
              label="outlined"
              leadingIcon={<CancelIcon width={20} height={20} />}
              trailingIcon={<CancelIcon width={20} height={20} />}
              controlledIsSelected={isSelected}
              onClick={handleClick}
            />
            <ActionChip
              variant="outlined"
              label="outlined"
              leadingIcon={<CancelIcon width={20} height={20} />}
              trailingIcon={<CancelIcon width={20} height={20} />}
              controlledIsSelected={isSelected}
              onClick={handleClick}
              disabled
            />
          </div>
        </div>
        <div>
          <div>
            <div className="flex gap-2 px-2 py-2 bg-grey-200 flex-wrap w-fit">
              <h1>비제어 컴포넌트</h1>
              <div className="flex gap-2 px-2 py-2 bg-grey-200 flex-wrap w-fit">
                <ActionChip variant="filled" label="Filled" />
                <ActionChip
                  variant="filled"
                  leadingIcon={<CancelIcon width={20} height={20} />}
                  label="Filled"
                />
                <ActionChip
                  variant="filled"
                  trailingIcon={<CancelIcon width={20} height={20} />}
                  label="Filled"
                />
                <ActionChip
                  variant="filled"
                  label="Filled"
                  leadingIcon={<CancelIcon width={20} height={20} />}
                  trailingIcon={<CancelIcon width={20} height={20} />}
                />
                <ActionChip
                  variant="filled"
                  label="Filled"
                  leadingIcon={<CancelIcon width={20} height={20} />}
                  trailingIcon={<CancelIcon width={20} height={20} />}
                  disabled
                />
              </div>
              <div className="flex gap-2 px-2 py-2 bg-grey-200 flex-wrap w-fit">
                <ActionChip variant="outlined" label="outlined" />
                <ActionChip
                  variant="outlined"
                  leadingIcon={<CancelIcon width={20} height={20} />}
                  label="outlined"
                />
                <ActionChip
                  variant="outlined"
                  trailingIcon={<CancelIcon width={20} height={20} />}
                  label="outlined"
                />
                <ActionChip
                  variant="outlined"
                  label="outlined"
                  leadingIcon={<CancelIcon width={20} height={20} />}
                  trailingIcon={<CancelIcon width={20} height={20} />}
                />
                <ActionChip
                  variant="outlined"
                  label="outlined"
                  leadingIcon={<CancelIcon width={20} height={20} />}
                  trailingIcon={<CancelIcon width={20} height={20} />}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
};

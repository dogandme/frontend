import { StoryObj } from "@storybook/react";
import { CloseIcon } from "../icon";
import { InfoChip } from "./InfoChip";

export default {
  title: "shared/InfoChip",
  component: InfoChip,
  parameters: {
    docs: {
      description: {
        component:
          "정적인 정보를 담고 있는 InfoChip 컴포넌트 입니다. size 속성을 통해 크기를 조절할 수 있습니다. 텍스트만 사용하거나 아이콘과 텍스트를 함께 사용할 수 있습니다.",
      },
    },
  },
};

type Story = StoryObj<ReturnType<typeof InfoChip>>;

export const Default: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-2 px-2 py-2">
        <div>
          <h1 className="title-1">Size = small</h1>
          <div className="flex gap-2">
            <InfoChip size="small">label</InfoChip>
            <InfoChip size="small">
              <CloseIcon width={20} height={20} />
              <span>label</span>
            </InfoChip>
          </div>
        </div>
        <div>
          <h1 className="title-1">Size = medium</h1>
          <div className="flex gap-2">
            <InfoChip size="medium">label</InfoChip>
            <InfoChip size="medium">
              <CloseIcon width={20} height={20} />
              <span>label</span>
            </InfoChip>
          </div>
        </div>
      </div>
    );
  },
};

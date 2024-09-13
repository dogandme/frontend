import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import ImgSlider from "./ImgSlider";

const meta: Meta<typeof ImgSlider> = {
  title: "shared/ImgSlider",
  component: ImgSlider,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      return (
        <div className="w-60 border-4 border-grey-900">
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    componentSubtitle: "이미지들을 슬라이드로 보여주는 컴포넌트입니다.",
    docs: {
      description: {
        component:
          "ImgSlider.ImgItem 컴포넌트는 이미지를 보여줍니다. ImgItem의 props 중 onRemove는 이미지를 삭제하는 버튼의 클릭 핸들러입니다.\n\nImgSlider.Item 컴포넌트는 이미지가 아닌 다른 컨텐츠를 보여줍니다.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ImgSlider>;

export const Default: Story = {
  render: () => (
    <ImgSlider>
      <ImgSlider.Item onClick={() => console.log("button!")}>
        button
      </ImgSlider.Item>
      <ImgSlider.ImgItem
        src="/public/default-image.png"
        alt="landing-image"
        onRemove={() => {
          action("onRemove")();
        }}
      />
      <ImgSlider.ImgItem
        src="/public/default-image.png"
        alt="landing-image"
        onRemove={() => {
          action("onRemove")();
        }}
      />
      <ImgSlider.ImgItem
        src="/public/default-image.png"
        alt="landing-image"
        onRemove={() => {
          action("onRemove")();
        }}
      />
      <ImgSlider.ImgItem
        src="/public/default-image.png"
        alt="landing-image"
        onRemove={() => {
          action("onRemove")();
        }}
      />
      <ImgSlider.ImgItem
        src="/public/default-image.png"
        alt="landing-image"
        onRemove={() => console.log("remove")}
      />
    </ImgSlider>
  ),
};

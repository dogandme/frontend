import type { Meta, StoryObj } from "@storybook/react";
import Slider from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "shared/Slider",
  component: Slider,
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
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => (
    <Slider>
      <Slider.Item>
        <button className="w-full h-full">icon!</button>
      </Slider.Item>
      <Slider.ImgItem
        src="/public/default-image.png"
        alt="landing-image"
        onRemove={() => console.log("remove")}
      />
      <Slider.ImgItem
        src="/public/default-image.png"
        alt="landing-image"
        onRemove={() => console.log("remove")}
      />
      <Slider.ImgItem
        src="/public/default-image.png"
        alt="landing-image"
        onRemove={() => console.log("remove")}
      />
      <Slider.ImgItem
        src="/public/default-image.png"
        alt="landing-image"
        onRemove={() => console.log("remove")}
      />
      <Slider.ImgItem
        src="/public/default-image.png"
        alt="landing-image"
        onRemove={() => console.log("remove")}
      />
    </Slider>
  ),
};

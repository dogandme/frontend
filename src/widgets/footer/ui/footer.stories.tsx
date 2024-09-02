import { Meta, StoryObj } from "@storybook/react";
import { MainFooter } from "./MainFooter";
import { within, userEvent, expect } from "@storybook/test";

const meta: Meta = {
  title: "Widgets/Footer",
  parameters: {
    docs: {
      description: {
        component: "하단 푸터를 모아둔 스토리북입니다.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MainFooter>;

export const Default: Story = {
  decorators: (Story) => (
    <div className="flex w-96 flex-col gap-3 px-2 py-2">
      <Story />
    </div>
  ),

  render: () => {
    return (
      <div>
        <h1>MainFooter</h1>
        <MainFooter />
      </div>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $search = canvas.getByText("발견");
    const $map = canvas.getByText("지도");
    const $community = canvas.getByText("커뮤니티");
    const $record = canvas.getByText("기록");

    const activeNameClass = "text-tangerine-500";
    const inactiveNameClass = "text-grey-400";

    await step(
      "기본 상태에선 / 경로를 나타내는 발견이 활성화 되어 있다.",
      async () => {
        expect($search).toHaveClass(activeNameClass);
        expect($map).toHaveClass(inactiveNameClass);
        expect($community).toHaveClass(inactiveNameClass);
        expect($record).toHaveClass(inactiveNameClass);
      },
    );

    await step("지도를 클릭하면 지도가 활성화 되어야 한다.", async () => {
      await userEvent.click($map);
      expect($search).toHaveClass(inactiveNameClass);
      expect($map).toHaveClass(activeNameClass);
      expect($community).toHaveClass(inactiveNameClass);
      expect($record).toHaveClass(inactiveNameClass);
    });
  },
};

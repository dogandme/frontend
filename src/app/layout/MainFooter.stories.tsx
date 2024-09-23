import { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";
import { MainFooter } from "./MainFooter";

const meta: Meta = {
  title: "app/layout/MainFooter",
  parameters: {
    docs: {
      description: {
        component: "map 에서 사용하는 NavigationFooter 의 스토리북입니다.",
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
    const $record = canvas.getByText("My");

    const activeNameClass = "text-tangerine-500";
    const inactiveNameClass = "text-grey-400";

    await step(
      "기본 상태에선 / 경로를 나타내는 발견이 활성화 되어 있다.",
      async () => {
        expect($search).toHaveClass(activeNameClass);
        expect($map).toHaveClass(inactiveNameClass);
        expect($record).toHaveClass(inactiveNameClass);
      },
    );

    await step("지도를 클릭하면 지도가 활성화 되어야 한다.", async () => {
      await userEvent.click($map);
      expect($search).toHaveClass(inactiveNameClass);
      expect($map).toHaveClass(activeNameClass);
      expect($record).toHaveClass(inactiveNameClass);
    });
  },
};

import { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";
import { FooterNavigationBar } from "./FooterNavigationBar";

const meta: Meta = {
  title: "app/layout/FooterNavigationBar",
  parameters: {
    docs: {
      description: {
        component: "map 에서 사용하는 NavigationFooter 의 스토리북입니다.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FooterNavigationBar>;

export const Default: Story = {
  decorators: (Story) => (
    <div className="flex w-96 flex-col gap-3 px-2 py-2">
      <Story />
    </div>
  ),

  render: () => {
    return (
      <div>
        <h1>FooterNavigationBar</h1>
        <FooterNavigationBar />
      </div>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $map = canvas.getByText("지도");
    const $my = canvas.getByText("My");

    const activeNameClass = "text-tangerine-500";
    const inactiveNameClass = "text-grey-400";

    await step("지도를 클릭하면 지도가 활성화 된다.", async () => {
      await userEvent.click($map);
      expect($map).toHaveClass(activeNameClass);
      expect($my).toHaveClass(inactiveNameClass);
    });

    await step("My를 클릭하면 My가 활성화 되어야 한다.", async () => {
      await userEvent.click($my);
      expect($map).toHaveClass(inactiveNameClass);
      expect($my).toHaveClass(activeNameClass);
    });
  },
};

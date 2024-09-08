import { Meta, StoryObj } from "@storybook/react";
import * as Pin from "./Pin";

const meta: Meta<typeof Pin.Default> = {
  title: "entities/map/Pin",
  component: Pin.Default,
};

export default meta;

type Story = StoryObj<typeof Pin.Default>;

export const Default: Story = {
  decorators: [
    (Story) => {
      return (
        <div className="flex flex-col gap-2">
          <Story />
        </div>
      );
    },
  ],

  render: () => (
    <>
      <div>
        <h1>Default Pin</h1>
        <Pin.Default imageUrl="/public/default-profile.svg" />
      </div>
      <div>
        <h1>Multiple Pin</h1>
        <p>MultiplePin 에서 amount의 최대값은 99입니다.</p>
        <div className="flex gap-4">
          <Pin.Multiple imageUrl="/public/default-profile.svg" amount={2} />
          <Pin.Multiple imageUrl="/public/default-profile.svg" amount={5000} />
        </div>
      </div>
      <div>
        <h1>Cluster Pin</h1>
        <Pin.Cluster amount={16} />
      </div>
    </>
  ),
};

import { Meta, StoryObj } from "@storybook/react";
import { ProfileOverView } from "./ProfileOverView";

export default {
  title: "Widgets/Profile/ProfileOverView",
  component: ProfileOverView,
} as Meta;

type Story = StoryObj<typeof ProfileOverView>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],

  render: () => <ProfileOverView />,
};

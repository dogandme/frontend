import { Meta, StoryObj } from "@storybook/react";
import { InfoSnackBar } from "./InfoSnackbar";

const meta: Meta<typeof InfoSnackBar> = {
  title: "shared/Snackbar/InfoSnackBar",
  component: InfoSnackBar,
};

export default meta;

type Story = StoryObj<typeof InfoSnackBar>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="relative h-[600px] w-96 border">
        <Story />
      </div>
    ),
  ],

  render: () => (
    <InfoSnackBar onClose={() => Promise.resolve()} autoHideDuration={1000}>
      이메일을 입력해 주세요
    </InfoSnackBar>
  ),
};

import { Meta, StoryObj } from "@storybook/react";
import PetInfoPage from "./page";

const meta: Meta = {
  title: "pages/sign-up/pet-info",
  component: PetInfoPage,
  decorators: [
    (Story) => (
      <div className="w-96 border border-grey-300">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PetInfoPage>;
export const Default: Story = {
  render: () => <PetInfoPage />,
};

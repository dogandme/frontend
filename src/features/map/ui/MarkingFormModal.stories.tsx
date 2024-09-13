import { Meta, StoryObj } from "@storybook/react";
import { MarkingFormModal } from "./MarkingFormModal";

const meta: Meta<typeof MarkingFormModal> = {
  title: "features/map/MarkingFormModal",
  component: MarkingFormModal,
};

export default meta;

type Story = StoryObj<typeof MarkingFormModal>;

export const Default: Story = {
  render: () => <MarkingFormModal onClose={() => Promise.resolve()} />,
};

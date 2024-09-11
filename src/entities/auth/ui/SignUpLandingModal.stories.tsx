import { Meta, StoryObj } from "@storybook/react";
import { useAuthStore } from "@/shared/store/auth";
import { SignUpLandingModal } from "./SignUpLandingModal";

const meta: Meta<typeof SignUpLandingModal> = {
  title: "entities/auth/SignupLandingModal",
  component: SignUpLandingModal,
};

export default meta;

export const Default: StoryObj<typeof SignUpLandingModal> = {
  decorators: [
    (Story) => {
      useAuthStore.setState({ nickname: "뽀송송" });

      return (
        <div id="root">
          <Story />
        </div>
      );
    },
  ],

  render: () => <SignUpLandingModal onClose={async () => {}} />,
};

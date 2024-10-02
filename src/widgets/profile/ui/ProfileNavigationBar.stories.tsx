import { useEffect } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { useAuthStore } from "@/shared/store";
import { ProfileNavigationBar } from "./ProfileNavigationBar";

const meta: Meta<typeof ProfileNavigationBar> = {
  title: "widgets/profile/MyPageNavigationBar",
  component: ProfileNavigationBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "/my-page에서 사용되는 NavigationBar 컴포넌트입니다. 로그인 여부에 따라 다른 UI를 보여줍니다. 로그인이 되어 있지 않다면 로그인 페이지로 이동 시킵니다.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MyPageNavigationBar_>;

const MyPageNavigationBar_ = ({ login }: { login: string | null }) => {
  return <ProfileNavigationBar role={login} nickname="뽀송송" />;
};

export const Default: Story = {
  decorators: [
    (Story) => {
      useAuthStore.setState({ nickname: "뽀송송" });

      return (
        <div className="w-96 border border-grey-200">
          <Story />
        </div>
      );
    },
  ],

  argTypes: {
    login: {
      control: {
        type: "select",
      },
      options: [null, "ROLE_NONE", "ROLE_GUEST", "ROLE_USER", "ROLE_ADMIN"],
    },
  },

  args: {
    login: null,
  },

  render: (args: { login: string | null }) => (
    <MyPageNavigationBar_ login={args.login} />
  ),
};

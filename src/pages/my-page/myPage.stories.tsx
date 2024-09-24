import { useEffect } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { useAuthStore } from "@/shared/store";
import { MyPage } from "./page";

export default {
  title: "Pages/MyPage",
  component: MyPage,
} as Meta;

type Story = StoryObj<typeof MyPage_>;

interface MyPageOnStorybookProps {
  role: null | "ROLE_NONE" | "ROLE_GUEST" | "ROLE_USER";
}

const MyPage_ = ({ role }: MyPageOnStorybookProps) => {
  const setRole = useAuthStore((state) => state.setRole);
  useEffect(() => {
    setRole(role);
  }, [role, setRole]);

  return <MyPage />;
};

export const Default: Story = {
  decorators: [
    (Story) => {
      useAuthStore.setState({ nickname: "뽀송송" });

      return (
        <div className="w-96">
          <Story />
        </div>
      );
    },
  ],

  argTypes: {
    role: {
      control: {
        type: "select",
      },
      options: [null, "ROLE_NONE", "ROLE_GUEST", "ROLE_USER"],
    },
  },

  render: (args) => <MyPage_ {...args} />,
};

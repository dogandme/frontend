import { Meta, StoryObj } from "@storybook/react";
import { ProfileOverView } from "./ProfileOverView";

export default {
  title: "Widgets/Profile/ProfileOverView",
  component: ProfileOverView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "마이페이지에서 유저와 강아지의 정보를 받아 상세 정보를 나타내는 컴포넌트입니다. ",
      },
    },
  },
  argTypes: {
    pet: {
      description: "강아지의 정보 객체입니다.",
      control: {
        type: "object",
      },
      defaultValue: {
        profile: "/default-image.png",
        personalities: [
          "온순한",
          "애정이 많은",
          "사람을 좋아하는",
          "애교가 많은",
        ],
        name: "뽀송이",
        description:
          "안녕하세요 뽀송이입니다. 너무나도 귀엽죠 ? 푸항항항 반갑습니다",
        breed: "비숑프리제",
      },
    },
    followers: {
      description: "팔로워 리스트 입니다.",
    },
    followings: {
      description: "팔로잉 리스트 입니다.",
    },
  },
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
  args: {
    pet: {
      profile: "/default-image.png",
      personalities: [
        "온순한",
        "애정이 많은",
        "사람을 좋아하는",
        "애교가 많은",
      ],
      name: "뽀송이",
      description:
        "안녕하세요 뽀송이입니다. 너무나도 귀엽죠 ? 푸항항항 반갑습니다",
      breed: "비숑프리제",
    },
    followers: Array.from({ length: 100 }, (_, i) => i),
    followings: Array.from({ length: 100 }, (_, i) => i),
  },
  render: (args) => (
    <ProfileOverView
      nickname="뽀송송"
      pet={args.pet}
      followers={args.followers}
      followings={args.followings}
    />
  ),
};

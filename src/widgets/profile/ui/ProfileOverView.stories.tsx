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

  argTypes: {
    profile: {
      description: "강아지 정보를 등록한 경우 저장되는 이미지의 url 입니다.",
    },
    description: {
      description: "강아지의 소개글 입니다.",
    },
    personalities: {
      description: "강아지의 성격 리스트 입니다.",
    },
    name: {
      description: "강아지의 이름 입니다.",
    },
    breed: {
      description: "강아지의 품종 입니다.",
    },
    followers: {
      description: "팔로워 리스트 입니다.",
    },
    followings: {
      description: "팔로잉 리스트 입니다.",
    },
  },

  render: () => (
    <ProfileOverView
      profile="/default-image.png"
      personalities={[
        "온순한",
        "애정이 많은",
        "사람을 좋아하는",
        "애교가 많은",
      ]}
      name="뽀송이"
      description="안녕하세요 뽀송이입니다. 너무나도 귀엽죠 ? 푸항항항 반갑습니다"
      breed="비숑프리제"
      followers={Array.from({ length: 100 }, (_, i) => i)}
      followings={Array.from({ length: 100 }, (_, i) => i)}
    />
  ),
};

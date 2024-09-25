import { Meta, StoryObj } from "@storybook/react";
import { MarkingItem } from "./MarkingItem";

const meta: Meta<typeof MarkingItem> = {
  title: "features/marking/MarkingItem",
  component: MarkingItem,
  tags: ["autodocs"],
  argTypes: {
    showRegion: {
      description: "주소를 보여줄지 여부를 나타냅니다.",
      control: "boolean",
    },
    onRegionClick: {
      description: "주소를 클릭했을 때 실행할 함수입니다.",
    },
    markingId: {
      description: "마킹 id입니다.",
      control: "number",
    },
    region: {
      description: "주소를 나타냅니다.",
      control: "text",
    },
    content: {
      description: "내용을 나타냅니다.",
      control: "text",
    },
    isVisible: {
      description: "마킹의 공개 여부를 나타냅니다.",
      control: "boolean",
    },
    regDt: {
      description: "마킹을 기록한 날짜입니다.",
      control: "text",
    },
    userId: {
      description: "마킹 작성자의 id입니다.",
      control: "number",
    },
    nickName: {
      description: "마킹 작성자의 닉네임입니다.",
      control: "text",
    },
    isOwner: {
      description: "사용자가 마킹 작성자와 동일한지를 나타냅니다.",
      control: "boolean",
    },
    lat: {
      description: "위도입니다.",
      control: "number",
    },
    lng: {
      description: "경도입니다.",
      control: "number",
    },
    countData: {
      description: "좋아요 개수와 북마크 개수를 나타냅니다.",
      control: "object",
    },
    pet: {
      description:
        "펫과 관련된 정보를 나타냅니다. (petId: 펫 id, name: 펫 이름, profile: 펫 프로필 사진)",
      control: "object",
    },
    images: {
      description: "마킹에 올린 이미지들을 나타냅니다.",
    },
  },
  args: {
    pet: {
      profile: "https://via.placeholder.com/150",
      name: "펫 이름",
      petId: 1,
    },
    nickName: "닉네임",
    images: [
      {
        id: 1,
        imageUrl: "https://via.placeholder.com/150",
        lank: 1,
        regDt: "2024-09-12T08:20:18.087+00:00",
      },
    ],
    region: "서울특별시 강남구",
    content:
      "내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용",
    regDt: "2024-09-12T08:20:18.087+00:00",
    countData: {
      likedCount: 1,
      savedCount: 1,
    },
  },
};

export default meta;

type Story = StoryObj<typeof MarkingItem>;

export const Default: Story = {};

export const MarkingList: Story = {};

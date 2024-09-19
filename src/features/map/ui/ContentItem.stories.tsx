import { Meta, StoryObj } from "@storybook/react";
import ContentItem from "./ContentItem";

const meta: Meta<typeof ContentItem> = {
  title: "features/map/ContentItem",
  component: ContentItem,
  tags: ["autodocs"],
  argTypes: {
    petName: {
      description: "펫 이름을 나타냅니다.",
      control: "text",
    },
    petImage: {
      description: "펫 이미지를 나타냅니다.",
      control: "text",
    },
    images: {
      description: "마킹에 올린 이미지들을 나타냅니다.",
    },
    address: {
      description: "주소를 나타냅니다.",
      control: "text",
    },
    content: {
      description: "내용을 나타냅니다.",
      control: "text",
    },
    date: {
      description: "마킹을 기록한 날짜입니다.",
      control: "text",
    },
    likeCount: {
      description: "좋아요 개수입니다.",
      control: "number",
    },
    bookmarkCount: {
      description: "북마크 개수입니다.",
      control: "number",
    },
    isLiked: {
      description: "좋아요 여부입니다.",
      control: "boolean",
    },
    isBookmarked: {
      description: "북마크 여부입니다.",
      control: "boolean",
    },
    isOwner: {
      description: "사용자가 마킹 작성자인지 확인합니다.",
      control: "boolean",
    },
  },
  args: {
    petName: "펫 이름",
    petImage: "https://via.placeholder.com/150",
    images: [
      {
        id: 1,
        imageUrl: "https://via.placeholder.com/150",
        lank: 1,
        regDt: "2024-09-12T08:20:18.087+00:00",
      },
    ],
    address: "서울특별시 강남구",
    content:
      "내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용",
    date: "2024-09-12T08:20:18.087+00:00",
    likeCount: 1,
    bookmarkCount: 1,
  },
};

export default meta;

type Story = StoryObj<typeof ContentItem>;

export const Default: Story = {};

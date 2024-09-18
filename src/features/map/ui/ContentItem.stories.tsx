import { Meta, StoryObj } from "@storybook/react";
import ContentItem from "./ContentItem";

const meta: Meta<typeof ContentItem> = {
  title: "features/map/ContentItem",
  component: ContentItem,
  args: {
    address: "서울특별시 강남구",
    content:
      "내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용",
    date: "2021-09-23",
    likeCount: 1,
    bookmarkCount: 1,
  },
};

export default meta;

type Story = StoryObj<typeof ContentItem>;

export const Default: Story = {};

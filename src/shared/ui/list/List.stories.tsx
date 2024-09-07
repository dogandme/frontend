import type { Meta, StoryObj } from "@storybook/react";

import List, { Item } from "./List";

const meta: Meta<typeof List> = {
  title: "shared/List",
  component: List,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    componentSubtitle:
      "List 컴포넌트는 항목들을 리스트 형식으로 표시할 때 사용합니다.",
    docs: {
      description: {
        component: "각 항목을 `List.Item` 컴포넌트로 감싸서 작성해주세요.",
      },
    },
  },
};

export default meta;

type ListStory = StoryObj<typeof List>;

export const Default: ListStory = {
  render: () => {
    return (
      <List>
        <List.Item>Item 1</List.Item>
        <List.Item>Item 2</List.Item>
        <List.Item>Item 3</List.Item>
      </List>
    );
  },
};

type ItemStory = StoryObj<typeof Item>;

export const ListItem: ItemStory = {
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
  render: ({ disabled }) => {
    return <List.Item disabled={disabled}>Item 1</List.Item>;
  },
};

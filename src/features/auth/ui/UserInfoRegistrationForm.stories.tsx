import type { Meta, StoryObj } from "@storybook/react";

import UserInfoRegistrationForm from "./UserInfoRegistrationForm";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof UserInfoRegistrationForm> = {
  title: "features/auth/UserInfoRegistrationForm",
  component: UserInfoRegistrationForm,
  tags: ["autodocs"],
  args: {},
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof UserInfoRegistrationForm>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <UserInfoRegistrationForm />
    </div>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $nicknameInput = canvasElement.querySelector(
      'input[name="nickname"]',
    ) as HTMLInputElement;

    await step(
      'focus된 상태에서 입력값의 길이가 0일때, "20자 이내의 한글 영어 숫자만 사용 가능합니다." 안내문구가 뜬다.',
      async () => {
        await userEvent.click($nicknameInput);

        const $statusText = canvas.getByText(
          "20자 이내의 한글 영어 숫자만 사용 가능합니다.",
        );
        expect($statusText).toBeInTheDocument();
        expect($statusText).toHaveClass("text-grey-500");
      },
    );

    await step(
      '닉네임 형식에 맞지 않게 입력할 경우, "20자 이내의 한글 영어 숫자만 사용 가능합니다." 색상이 pink-500으로 표시된다.',
      async () => {
        await userEvent.type($nicknameInput, "!!@#$@");
        // outfocus되도 statusText를 pink-500 색상으로 표시
        await userEvent.tab();

        const $statusText = canvas.getByText(
          "20자 이내의 한글 영어 숫자만 사용 가능합니다.",
        );
        expect($statusText).toHaveClass("text-pink-500");
      },
    );

    await step(
      '닉네임 형식에 맞게 입력한 경우, "20자 이내의 한글 영어 숫자만 사용 가능합니다." 색상이 grey-500으로 표시된다.',
      async () => {
        // 이메일 입력 필드의 값을 초기화합니다.
        await userEvent.clear($nicknameInput);
        await userEvent.type($nicknameInput, "hihihi");

        const $statusText = canvas.getByText(
          "20자 이내의 한글 영어 숫자만 사용 가능합니다.",
        );

        expect($statusText).toHaveClass("text-grey-500");
      },
    );

    await step(
      '닉네임 형식에 맞게 입력한 상태에서 outfocus되면, "20자 이내의 한글 영어 숫자만 사용 가능합니다." 문구가 사라진다.',
      async () => {
        await userEvent.tab();

        const $statusText = canvas.queryByText(
          "20자 이내의 한글 영어 숫자만 사용 가능합니다.",
        );
        expect($statusText).not.toBeInTheDocument();
      },
    );
  },
};

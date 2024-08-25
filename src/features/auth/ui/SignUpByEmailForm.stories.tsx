import type { Meta, StoryObj } from "@storybook/react";

import SignUpByEmailForm from "./SignUpByEmailForm";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof SignUpByEmailForm> = {
  title: "features/auth/SignUpByEmailForm",
  component: SignUpByEmailForm,
  tags: ["autodocs"],
  args: {},
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof SignUpByEmailForm>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <SignUpByEmailForm />
    </div>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $emailInput = canvasElement.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement;

    await step(
      '이메일 입력 필드를 focus하면, "이메일 형식으로 입력해 주세요" 문구가 뜨고 색상은 grey-500으로 표시된다.',
      async () => {
        await userEvent.click($emailInput);

        const $statusText = canvas.getByText("이메일 형식으로 입력해 주세요");
        expect($statusText).toBeInTheDocument();
        expect($statusText).toHaveClass("text-grey-500");
      },
    );

    await step(
      '이메일 형식에 맞지 않게 입력할 경우, "이메일 형식으로 입력해 주세요" 색상이 pink-500으로 표시된다.',
      async () => {
        const DELAY = 500;
        const DELTA = 100;

        await userEvent.type($emailInput, "invalid-email");
        await new Promise((resolve) => setTimeout(resolve, DELAY + DELTA));
        // outfocus되도 statusText를 pink-500 색상으로 표시
        await userEvent.tab();

        const $statusText = canvas.getByText("이메일 형식으로 입력해 주세요");
        expect($statusText).toHaveClass("text-pink-500");
      },
    );

    await step(
      '이메일 형식에 맞게 입력한 경우, "이메일 형식으로 입력해 주세요" 색상이 grey-500으로 표시된다.',
      async () => {
        // 이메일 입력 필드의 값을 초기화합니다.
        await userEvent.clear($emailInput);
        await userEvent.type($emailInput, "hi@example.com");

        const DELAY = 500;
        const DELTA = 100;

        const $statusText = canvas.getByText("이메일 형식으로 입력해 주세요");
        await new Promise((resolve) => setTimeout(resolve, DELAY + DELTA));

        expect($statusText).toHaveClass("text-grey-500");
      },
    );

    await step(
      '이메일 형식에 맞게 입력한 상태에서 outfocus되면, "이메일 형식으로 입력해 주세요" 문구가 사라진다.',
      async () => {
        await userEvent.tab();

        const $statusText = canvas.queryByText("이메일 형식으로 입력해 주세요");
        expect($statusText).not.toBeInTheDocument();
      },
    );
  },
};

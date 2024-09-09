import type { Meta, StoryObj } from "@storybook/react";

import SignUpByEmailForm from "./SignUpByEmailForm";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof SignUpByEmailForm> = {
  title: "features/auth/SignUpByEmailForm",
  component: SignUpByEmailForm,
  tags: ["autodocs"],
  args: {},
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SignUpByEmailForm>;

export const Default: Story = {
  render: () => <SignUpByEmailForm />,

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $emailInput = canvasElement.querySelector("#email")!;

    const statusTextColor = {
      valid: "text-grey-500",
      invalid: "text-pink-500",
    };

    await step("이메일 input 형식 검사", async () => {
      const emailStatusText = "이메일 형식으로 입력해 주세요";

      await step(
        '이메일 입력 필드를 focus하면, "이메일 형식으로 입력해 주세요" 안내 문구가 뜬다.',
        async () => {
          await userEvent.click($emailInput);

          const $statusText = canvas.getByText(emailStatusText);

          expect($statusText).toBeInTheDocument();
          expect($statusText).toHaveClass(statusTextColor.valid);
        },
      );

      const validEmail = "hi@example.com";
      const invalidEmail = "invalid-email";

      await step("이메일 형식에 맞지 않게 입력할 경우,", async () => {
        await userEvent.type($emailInput, invalidEmail);

        const $statusText = canvas.getByText(emailStatusText);

        await step("안내 문구가 핑크색으로 표시된다.", () => {
          expect($statusText).toHaveClass(statusTextColor.invalid);
        });

        await step(
          "outfocus되도, 안내 문구를 핑크색으로 표시한다.",
          async () => {
            await userEvent.tab();
            expect($statusText).toHaveClass(statusTextColor.invalid);
          },
        );
      });

      await step(
        "이메일 형식에 맞게 입력한 경우, 안내 문구가 기본색으로 표시된다.",
        async () => {
          await userEvent.clear($emailInput);
          await userEvent.type($emailInput, validEmail);

          const $statusText = canvas.getByText(emailStatusText);

          expect($statusText).toHaveClass(statusTextColor.valid);
        },
      );

      await step(
        "이메일 형식에 맞게 입력한 상태에서 outfocus되면, 안내 문구가 사라진다.",
        async () => {
          await userEvent.tab();

          const $statusText = canvas.queryByText(emailStatusText);

          expect($statusText).not.toBeInTheDocument();
        },
      );

      await step(
        "이메일 형식에 맞게 입력한 상태에서 [코드전송] 버튼을 클릭할 수 있다.",
        async () => {
          const $sendConfirmCodeButton = canvas.getByText("코드전송");
          expect($sendConfirmCodeButton).toBeEnabled();
        },
      );
    });
  },
};

import type { Meta, StoryObj } from "@storybook/react";

import SignUpByEmailForm from "./SignUpByEmailForm";
import { expect, userEvent, within } from "@storybook/test";
import { useAuthStore } from "@/shared/store/auth";
import { signUpByEmailHandlers } from "@/mocks/handler";
import { OverlayPortal } from "@/app/OverlayPortal";

const meta: Meta<typeof SignUpByEmailForm> = {
  title: "features/auth/SignUpByEmailForm",
  component: SignUpByEmailForm,
  tags: ["autodocs"],
  args: {},
  argTypes: {},
  decorators: [
    (Story) => (
      <div id="root">
        <OverlayPortal />
        <div className="w-96">
          <Story />
        </div>
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

    const validEmail = "hi@example.com";
    const invalidEmail = "invalid-email";
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

    await userEvent.clear($emailInput);

    const $codeSendButton = canvas.getByText("코드전송");

    await step("[코드 전송] 버튼", async () => {
      await step(
        "입력한 이메일이 형식에 맞지 않을 경우, 버튼은 비활성화된다.",
        async () => {
          await userEvent.type($emailInput, invalidEmail);
          expect($codeSendButton).toBeDisabled();
        },
      );

      await userEvent.clear($emailInput);

      await step(
        "입력한 이메일 값이 유효할 경우, 버튼은 활성화된다.",
        async () => {
          await userEvent.type($emailInput, validEmail);
          expect($codeSendButton).toBeEnabled();
        },
      );
    });
  },
};

export const ApiTest: Story = {
  decorators: (Story) => {
    useAuthStore.setState({
      token: null,
      role: null,
      nickname: null,
    });

    return <Story />;
  },

  parameters: {
    msw: {
      handlers: signUpByEmailHandlers,
    },
  },

  render: () => <SignUpByEmailForm />,

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const $emailInput = canvasElement.querySelector("#email")!;
    const validEmail = "hihihihihi@naver.com";
    const duplicatedEmail = "hihihi@naver.com";

    const $sendConfirmCodeButton = canvas.getByText("코드전송");
    const $codeInput = canvasElement.querySelector("#verification-code")!;

    const statusTextColor = {
      valid: "text-grey-500",
      invalid: "text-pink-500",
    };

    await step(
      "이미 가입된 이메일을 입력하고 [코드 전송] 버튼을 클릭할 경우,",
      async () => {
        await userEvent.type($emailInput, duplicatedEmail);
        await userEvent.click($sendConfirmCodeButton);

        await step(
          '"이미 가입된 이메일 입니다" 안내 문구가 핑크색으로 표시됩니다.',
          async () => {
            const $statusText =
              await canvas.findByText("이미 가입된 이메일 입니다");

            expect($statusText).toBeInTheDocument();
            expect($statusText).toHaveClass(statusTextColor.invalid);
          },
        );
        await step("버튼은 비활성화된다.", async () => {
          expect($sendConfirmCodeButton).toBeDisabled();
        });
      },
    );

    await userEvent.clear($emailInput);

    await step(
      "이메일을 올바르게 입력하고 [코드 전송] 버튼을 클릭하면, snackbar가 노출된다.",
      async () => {
        await userEvent.type($emailInput, validEmail);
        await userEvent.click($sendConfirmCodeButton);

        const $snackbar =
          await canvas.findByText("메일로 인증코드가 전송되었습니다");
        expect($snackbar).toBeInTheDocument();
      },
    );
  },
};

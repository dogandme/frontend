import { StoryObj } from "@storybook/react";
import { expect, userEvent } from "@storybook/test";
import { PasswordChangeModal } from "./passwordChangeModal";

export default {
  title: "features/setting/PasswordChangeModal",
  component: PasswordChangeModal,
};

type Story = StoryObj<typeof PasswordChangeModal>;

export const Default: Story = {
  render: () => <PasswordChangeModal onClose={async () => {}} />,

  play: async ({ canvasElement, step }) => {
    const $currentPasswordInput = canvasElement.querySelector(
      "#current-password",
    ) as HTMLInputElement;
    const $newPasswordInput = canvasElement.querySelector(
      "#new-password",
    ) as HTMLInputElement;
    const $confirmPasswordInput = canvasElement.querySelector(
      "#confirm-new-password",
    ) as HTMLInputElement;
    const currentPasswordStatusText = "현재 비밀번호를 입력해주세요.";
    const inValidStatusText = "비밀번호 형식에 맞게 입력해 주세요.";
    const inValidConfirmStatusText = "비밀번호가 서로 일치하지 않습니다.";
    const validPasswordStatusText = "사용가능한 비밀번호입니다.";
    const validConfirmPasswordStatusText = "비밀번호가 일치합니다.";

    await step(
      `현재 비밀번호 input에 focus하면 '${currentPasswordStatusText}' 안내문구가 뜨고, blur하면 사라진다.`,
      async () => {
        const $statusText = canvasElement.querySelectorAll("p")[0];

        const currentPassword = "password123!";

        await userEvent.click($currentPasswordInput);
        expect($statusText.textContent).toBe(currentPasswordStatusText);

        await userEvent.type($currentPasswordInput, currentPassword);

        await userEvent.tab();
        expect($statusText.textContent).toBe("");
      },
    );

    const newPassword = "!1234567a";

    await step("새 비밀번호 input", async () => {
      const $statusText = canvasElement.querySelectorAll("p")[1];

      await step(
        `형식에 맞지 않은 비밀번호를 입력하면, '${inValidStatusText}' 안내문구가 뜬다.`,
        async () => {
          await userEvent.type($newPasswordInput, newPassword.slice(0, 1));
          expect($statusText.textContent).toBe(inValidStatusText);
        },
      );

      await step(
        `올바른 비밀번호를 입력하면, '${validPasswordStatusText}' 안내문구가 뜬다.`,
        async () => {
          await userEvent.type($newPasswordInput, newPassword.slice(1));
          expect($statusText.textContent).toBe(validPasswordStatusText);
        },
      );
    });

    await step("새 비밀번호 확인 input", async () => {
      const $statusText = canvasElement.querySelectorAll("p")[2];

      await step(
        `형식에 맞지 않은 비밀번호를 입력하면, '${inValidStatusText}' 안내문구가 뜬다.`,
        async () => {
          await userEvent.type($confirmPasswordInput, newPassword.slice(0, 1));
          expect($statusText.textContent).toBe(inValidStatusText);
        },
      );

      await step(
        `새 비밀번호와 다른 비밀번호를 입력하면, '${inValidConfirmStatusText}' 안내문구가 뜬다.`,
        async () => {
          await userEvent.type($confirmPasswordInput, "123aabbcc!");
          expect($statusText.textContent).toBe(inValidConfirmStatusText);
        },
      );

      await userEvent.clear($confirmPasswordInput);

      await step(
        `새 비밀번호와 같은 비밀번호를 입력하면, '${validConfirmPasswordStatusText}' 안내문구가 뜬다.`,
        async () => {
          await userEvent.type($confirmPasswordInput, newPassword);
          expect($statusText.textContent).toBe(validConfirmPasswordStatusText);
        },
      );
    });
  },
};

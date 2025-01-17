import { StoryObj } from "@storybook/react";
import { expect, userEvent } from "@storybook/test";
import {
  passwordChangeFormErrorMessage,
  passwordChangeFormValidationMessage,
} from "../constants";
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

    await step(
      `현재 비밀번호 input에 focus하면 '${passwordChangeFormErrorMessage.currentPassword}' 안내문구가 뜨고, blur하면 사라진다.`,
      async () => {
        const $statusText = canvasElement.querySelectorAll("p")[0];

        const currentPassword = "password123!";

        await userEvent.click($currentPasswordInput);
        expect($statusText.textContent).toBe(
          passwordChangeFormErrorMessage.currentPassword,
        );

        await userEvent.type($currentPasswordInput, currentPassword);

        await userEvent.tab();
        expect($statusText.textContent).toBe("");
      },
    );

    const newPassword = "!1234567a";

    await step("새 비밀번호 input", async () => {
      const $statusText = canvasElement.querySelectorAll("p")[1];

      await step(
        `형식에 맞지 않은 비밀번호를 입력하면, '${passwordChangeFormErrorMessage.newPassword.pattern}' 안내문구가 뜬다.`,
        async () => {
          await userEvent.type($newPasswordInput, newPassword.slice(0, 1));
          expect($statusText.textContent).toBe(
            passwordChangeFormErrorMessage.newPassword.pattern,
          );
        },
      );

      await step(
        `올바른 비밀번호를 입력하면, '${passwordChangeFormValidationMessage.newPassword}' 안내문구가 뜬다.`,
        async () => {
          await userEvent.type($newPasswordInput, newPassword.slice(1));
          expect($statusText.textContent).toBe(
            passwordChangeFormValidationMessage.newPassword,
          );
        },
      );
    });

    await step("새 비밀번호 확인 input", async () => {
      const $statusText = canvasElement.querySelectorAll("p")[2];

      await step(
        `형식에 맞지 않은 비밀번호를 입력하면, '${passwordChangeFormErrorMessage.newPassword.pattern}' 안내문구가 뜬다.`,
        async () => {
          await userEvent.type($confirmPasswordInput, newPassword.slice(0, 1));
          expect($statusText.textContent).toBe(
            passwordChangeFormErrorMessage.newPassword.pattern,
          );
        },
      );

      await step(
        `새 비밀번호와 다른 비밀번호를 입력하면, '${passwordChangeFormErrorMessage.confirmPassword.isNotMatchedWithPassword}' 안내문구가 뜬다.`,
        async () => {
          await userEvent.type($confirmPasswordInput, "123aabbcc!");
          expect($statusText.textContent).toBe(
            passwordChangeFormErrorMessage.confirmPassword
              .isNotMatchedWithPassword,
          );
        },
      );

      await userEvent.clear($confirmPasswordInput);

      await step(
        `새 비밀번호와 같은 비밀번호를 입력하면, '${passwordChangeFormValidationMessage.confirmPassword}' 안내문구가 뜬다.`,
        async () => {
          await userEvent.type($confirmPasswordInput, newPassword);
          expect($statusText.textContent).toBe(
            passwordChangeFormValidationMessage.confirmPassword,
          );
        },
      );
    });
  },
};

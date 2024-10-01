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
    // PasswordInput 에 대한 기본적인 테스트는 실행 되었기에 변경된 store 가 잘 작동하는지에 대한 테스트 코드만 작성 합니다.
    const $currentPasswordInput = canvasElement.querySelector(
      "#current-password",
    ) as HTMLInputElement;
    const $newPasswordInput = canvasElement.querySelector(
      "#new-password",
    ) as HTMLInputElement;
    const $confirmPasswordInput = canvasElement.querySelector(
      "#confirm-new-password",
    ) as HTMLInputElement;
    const emptyStatusText = "비밀번호를 입력해 주세요";
    const inValidStatusText = "비밀번호 형식에 맞게 입력해 주세요";
    const inValidConfirmStatusText = "비밀번호가 서로 일치하지 않습니다";

    await step(
      `각 인풋 필드들은 focus시 statusText로 ${emptyStatusText}가 나타난다.`,
      async () => {
        const pTags = [...canvasElement.querySelectorAll("p")].slice(0, 3);
        await userEvent.click($currentPasswordInput);
        expect(pTags[0].textContent === emptyStatusText).toBeTruthy();

        await userEvent.click($newPasswordInput);
        expect(pTags[1].textContent === emptyStatusText).toBeTruthy();

        await userEvent.click($confirmPasswordInput);
        expect(pTags[2].textContent === emptyStatusText).toBeTruthy();
      },
    );

    await step("현재 비밀번호는 정규성 검사를 적절하게 시행한다.", async () => {
      const validPassword = "a1234567!";
      const $statusText = canvasElement.querySelectorAll("p")[0];
      // 일부만 입력
      await userEvent.type($currentPasswordInput, validPassword.slice(0, 1));
      expect($statusText.textContent).toBe(inValidStatusText);
      // 나머지 모두 입력
      await userEvent.type($currentPasswordInput, validPassword.slice(1));
      expect($statusText.textContent).toBe("");
      // 초기화
      await userEvent.clear($currentPasswordInput);
      expect($statusText.textContent).toBe(emptyStatusText);
    });

    await step("새 비밀번호는 정규성 검사를 적절하게 시행한다.", async () => {
      const validPassword = "!1234567a";
      const $statusText = canvasElement.querySelectorAll("p")[1];
      // 일부만 입력
      await userEvent.type($newPasswordInput, validPassword.slice(0, 1));
      expect($statusText.textContent).toBe(inValidStatusText);
      // 나머지 모두 입력
      await userEvent.type($newPasswordInput, validPassword.slice(1));
      expect($statusText.textContent).toBe("");
      // 초기화
      await userEvent.clear($newPasswordInput);
      expect($statusText.textContent).toBe(emptyStatusText);
    });

    await step(
      "새 비밀번호 확인은 정규성 검사를 적절하게 시행한다.",
      async () => {
        const $statusText = canvasElement.querySelectorAll("p")[2];
        // 새 비밀번호 확인은 새 비밀번호 값에 종속되어 있기에 새 비밀번호를 먼저 입력합니다.
        const validPassword = "!1234567aa";
        await userEvent.type($newPasswordInput, validPassword);

        await userEvent.click($confirmPasswordInput);
        expect($statusText.textContent).toBe(emptyStatusText);

        // 일부만 입력
        await userEvent.type($confirmPasswordInput, validPassword.slice(0, 1));
        expect($statusText.textContent).toBe(inValidConfirmStatusText);
        // 나머지 모두 입력
        await userEvent.type($confirmPasswordInput, validPassword.slice(1));
        expect($statusText.textContent).toBe("");

        // newPasswordInput 이 변경 되었을 때 statusText 가 변경 되는지 확인
        await userEvent.type($newPasswordInput, "{backspace}");
        expect($statusText.textContent).toBe(inValidConfirmStatusText);

        await userEvent.type($confirmPasswordInput, "{backspace}");
        expect($statusText.textContent).toBe("");

        // 초기화
        await userEvent.clear($confirmPasswordInput);
        await userEvent.clear($newPasswordInput);

        // confirmPasswordInput은 newPasswordInput이 정규성 검사를 만족하지 못하더라도 동일하기만 하면 statusText가 나타나지 않습니다.
        await userEvent.type($newPasswordInput, validPassword.slice(0, 3));
        await userEvent.type($confirmPasswordInput, validPassword.slice(0, 3));

        const $newPasswordStatusText = canvasElement.querySelectorAll("p")[1];
        expect($newPasswordStatusText.textContent).toBe(inValidStatusText);
        expect($statusText.textContent).toBe("");
      },
    );
  },
};

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

    await step("nickname input 검사", async () => {
      const STATUS_TEXT = "20자 이내의 한글 영어 숫자만 사용 가능합니다.";
      const textColor = {
        base: "text-grey-500",
        error: "text-pink-500",
      };

      await step(
        "focus된 상태에서 입력값의 길이가 0일때, 안내 문구가 뜬다.",
        async () => {
          await userEvent.click($nicknameInput);

          const $statusText = canvas.getByText(STATUS_TEXT);
          expect($statusText).toBeInTheDocument();
          expect($statusText).toHaveClass(textColor.base);
        },
      );

      await step(
        "닉네임 형식에 맞지 않게 입력할 경우, 안내 문구가 핑크색으로 표시된다.",
        async () => {
          await userEvent.type($nicknameInput, "!!@#$@");
          // outfocus되도 statusText를 pink-500 색상으로 표시
          await userEvent.tab();

          const $statusText = canvas.getByText(STATUS_TEXT);
          expect($statusText).toHaveClass(textColor.error);
        },
      );

      await step(
        "닉네임 형식에 맞게 입력한 경우, 안내 문구는 기본 색상으로 표시된다.",
        async () => {
          // 이메일 입력 필드의 값을 초기화합니다.
          await userEvent.clear($nicknameInput);
          await userEvent.type($nicknameInput, "hihihi");

          const $statusText = canvas.getByText(STATUS_TEXT);

          expect($statusText).toHaveClass(textColor.base);
        },
      );

      await step(
        "닉네임 형식에 맞게 입력한 상태에서 outfocus되면, 안내 문구가 사라진다.",
        async () => {
          await userEvent.tab();

          const $statusText = canvas.queryByText(STATUS_TEXT);
          expect($statusText).not.toBeInTheDocument();
        },
      );
    });

    await step("gender select 검사", async () => {
      const $genderLabel = canvas.getByText("성별");
      const $genderTriggerButton = canvasElement.querySelector("#gender");

      await step("성별 라벨을 클릭하면, 바텀 시트가 열린다.", async () => {
        await userEvent.click($genderLabel);

        expect($genderTriggerButton).toHaveFocus();

        const $bottomSheet = document.querySelector("#gender-select");

        expect($bottomSheet).toBeInTheDocument();
      });

      if (!$genderTriggerButton) return;

      await step(
        "성별 바텀시트의 trigger 버튼을 클릭하면, 바텀 시트가 열린다.",
        async () => {
          await userEvent.click($genderTriggerButton);

          const $bottomSheet = document.querySelector("#gender-select");

          expect($bottomSheet).toBeInTheDocument();
        },
      );

      await step(
        "바텀 시트에 '남자'를 선택하면, trigger 버튼에 '남자'가 표시된다.",
        async () => {
          const $bottomSheet = document.querySelector("#gender-select");
          const $optionList = $bottomSheet?.querySelectorAll("li");
          const $maleOption = $optionList?.[0];

          if (!$maleOption) return;
          await userEvent.click($maleOption);

          expect($genderTriggerButton).toHaveTextContent("남자");
        },
      );

      await step(
        "'남자'를 선택한 상태에서 바텀 시트를 다시 열면, '남자' 옵션이 빨간색으로 표시되어 있다.",
        async () => {
          await userEvent.click($genderTriggerButton);

          const $bottomSheet = document.querySelector("#gender-select");
          expect($bottomSheet).toBeInTheDocument();

          const $optionList = $bottomSheet?.querySelectorAll("li");
          const $maleOption = $optionList?.[0];

          if (!$maleOption) return;

          expect($maleOption).toHaveClass("text-tangerine-500");
        },
      );
    });
  },
};

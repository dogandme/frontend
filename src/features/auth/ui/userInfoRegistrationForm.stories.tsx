import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { OverlayPortal } from "@/app/OverlayPortal";
import { SnackbarController } from "@/shared/store";
import { useAuthStore } from "@/shared/store/auth";
import { handlers } from "@/mocks/handler";
import {
  REGION_API_DEBOUNCE_DELAY,
  userInfoFormErrorMessage,
  userInfoFormValidationMessage,
} from "../constants";
import UserInfoRegistrationForm from "./userInfoRegistrationForm";

const meta: Meta<typeof UserInfoRegistrationForm> = {
  title: "features/auth/UserInfoRegistrationForm",
  component: UserInfoRegistrationForm,
  tags: ["autodocs"],
  args: {},
  argTypes: {},
  decorators: (Story) => {
    return (
      <div id="root">
        <SnackbarController>
          <OverlayPortal />
          <div className="w-96">
            <Story />
          </div>
        </SnackbarController>
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof UserInfoRegistrationForm>;

export const Default: Story = {
  decorators: (Story) => {
    useAuthStore.setState({
      token: "accessToken-ROLE_NONE",
      role: "ROLE_NONE",
      nickname: null,
    });

    return <Story />;
  },

  parameters: {
    msw: { handlers },
  },

  render: () => <UserInfoRegistrationForm />,

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const $nicknameInput = canvasElement.querySelector(
      "#nickname",
    ) as HTMLInputElement;
    const validNickname = "hihihi";
    const invalidNickname = "   ";

    const $submitButton = canvas.getByText("회원가입");
    const $regionSelectButton = canvas.getByText("동네 설정하기");

    await step("nickname input 검사", async () => {
      const textColor = {
        base: "text-grey-500",
        error: "text-pink-500",
      };

      await step(
        `닉네임 형식에 맞지 않게 입력할 경우, "${userInfoFormErrorMessage.nickname.pattern}"가 빨간색으로 표시된다.`,
        async () => {
          await userEvent.type($nicknameInput, invalidNickname);
          await userEvent.tab();

          const $statusText = await canvas.findByText(
            userInfoFormErrorMessage.nickname.pattern,
          );
          expect($statusText).toHaveClass(textColor.error);
        },
      );

      await step(
        `중복된 닉네임을 입력할 경우, "${userInfoFormErrorMessage.nickname.validate}"가 빨간색으로 표시된다.`,
        async () => {
          await userEvent.clear($nicknameInput);
          await userEvent.type($nicknameInput, "중복");
          await userEvent.tab();

          const $statusText = await canvas.findByText(
            userInfoFormErrorMessage.nickname.validate,
          );
          expect($statusText).toHaveClass(textColor.error);
        },
      );

      await step(
        `유효한 닉네임을 입력할 경우, "${userInfoFormValidationMessage.email}"가 표시된다.`,
        async () => {
          await userEvent.clear($nicknameInput);
          await userEvent.type($nicknameInput, validNickname);
          await userEvent.tab();

          const $statusText = await canvas.findByText(
            userInfoFormValidationMessage.email,
          );
          expect($statusText).toHaveClass(textColor.base);
        },
      );
    });

    await step("gender select 검사", async () => {
      const $genderLabel = canvas.getByText("성별");
      const $genderTriggerButton = canvasElement.querySelector("#gender");

      await step(
        "성별을 선택하지 않은 상태에서 [회원가입] 버튼을 누르면, snackbar가 뜬다.",
        async () => {
          await userEvent.click($submitButton);

          const $snackbar = canvas.getByText(
            userInfoFormErrorMessage.submit.required,
          );
          expect($snackbar).toBeInTheDocument();

          const $snackBarCloseButton = canvas.getByLabelText("스낵바 닫기");

          await userEvent.click($snackBarCloseButton);
          await waitFor(
            () => {
              expect($snackBarCloseButton).not.toBeInTheDocument();
            },
            {
              timeout: 1000,
            },
          );
        },
      );

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

          await userEvent.click($maleOption!);

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

          expect($maleOption).toHaveClass("text-tangerine-500");

          await userEvent.click($maleOption!);
        },
      );
    });

    await step("age range select 검사", async () => {
      const $ageRangeLabel = canvas.getByText("연령대");
      const $ageRangeTriggerButton = canvasElement.querySelector("#age-range");

      await step(
        "연령대를 선택하지 않은 상태에서 [회원가입] 버튼을 누르면, snackbar가 뜬다.",
        async () => {
          await userEvent.click($submitButton);

          const $snackbar = canvas.getByText(
            userInfoFormErrorMessage.submit.required,
          );
          expect($snackbar).toBeInTheDocument();

          const $snackBarCloseButton = canvas.getByLabelText("스낵바 닫기");

          await userEvent.click($snackBarCloseButton);
          await waitFor(
            () => {
              expect($snackBarCloseButton).not.toBeInTheDocument();
            },
            { timeout: 1000 },
          );
        },
      );

      await step("연령대 라벨을 클릭하면, 바텀 시트가 열린다.", async () => {
        await userEvent.click($ageRangeLabel);

        expect($ageRangeTriggerButton).toHaveFocus();

        const $bottomSheet = document.querySelector("#age-range-select");

        expect($bottomSheet).toBeInTheDocument();
      });

      await step(
        "연령대 바텀시트의 trigger 버튼을 클릭하면, 바텀 시트가 열린다.",
        async () => {
          await userEvent.click($ageRangeTriggerButton!);

          const $bottomSheet = document.querySelector("#age-range-select");

          expect($bottomSheet).toBeInTheDocument();
        },
      );

      await step(
        "바텀 시트에 '10대'를 선택하면, trigger 버튼에 '10대'가 표시된다.",
        async () => {
          const $bottomSheet = document.querySelector("#age-range-select");
          const $optionList = $bottomSheet?.querySelectorAll("li");
          const $teenagerOption = $optionList?.[0];

          await userEvent.click($teenagerOption!);

          expect($ageRangeTriggerButton).toHaveTextContent("10대");
        },
      );

      await step(
        "'10대'를 선택한 상태에서 바텀 시트를 다시 열면, '10대' 옵션이 빨간색으로 표시되어 있다.",
        async () => {
          await userEvent.click($ageRangeTriggerButton!);

          const $bottomSheet = document.querySelector("#age-range-select");
          expect($bottomSheet).toBeInTheDocument();

          const $optionList = $bottomSheet?.querySelectorAll("li");
          const $teenagerOption = $optionList?.[0];

          if (!$teenagerOption) return;

          expect($teenagerOption).toHaveClass("text-tangerine-500");
          await userEvent.click($teenagerOption);
        },
      );
    });

    await step(
      "동네 설정을 제외하고 form 을 다 입력한 상태에서 [회원가입] 버튼을 누르면 snackbar가 뜬다.",
      async () => {
        await userEvent.clear($nicknameInput);
        await userEvent.type($nicknameInput, validNickname);
        await userEvent.type($nicknameInput, invalidNickname);
        await userEvent.click($submitButton);

        const $snackbar = canvas.getByText(
          userInfoFormErrorMessage.submit.required,
        );
        expect($snackbar).toBeInTheDocument();

        const $snackBarCloseButton = canvas.getByLabelText("스낵바 닫기");
        await userEvent.click($snackBarCloseButton);
        await waitFor(
          () => {
            expect($snackBarCloseButton).not.toBeInTheDocument();
          },
          {
            timeout: 1000,
          },
        );
      },
    );

    await step(
      "form을 다 입력했지만 이메일 형식에 맞지 않은 상태에서 [회원가입] 버튼을 누르면, snackbar가 뜬다.",
      async () => {
        await userEvent.clear($nicknameInput);
        await userEvent.type($nicknameInput, invalidNickname);
        await userEvent.click($regionSelectButton);

        const $regionSearchInput =
          canvasElement.querySelector("#region-search")!;
        await userEvent.type($regionSearchInput, "강남구 역삼동");

        await new Promise((res) => setTimeout(res, REGION_API_DEBOUNCE_DELAY)); // API 요청이 끝날 때까지 안전하게 딜레이 추가

        const $selectedRegion = await canvas.findByText(/강남구 역삼1동/);
        await userEvent.click($selectedRegion);

        const $confirmButton = canvas.getByText("확인");
        await userEvent.click($confirmButton);

        await userEvent.click($submitButton);

        const $snackbar = canvas.getByText(
          userInfoFormErrorMessage.submit.invalidNickname,
        );
        expect($snackbar).toBeInTheDocument();

        const $snackBarCloseButton = canvas.getByLabelText("스낵바 닫기");

        await userEvent.click($snackBarCloseButton);
        await waitFor(
          () => {
            expect($snackBarCloseButton).not.toBeInTheDocument();
          },
          {
            timeout: 1000,
          },
        );
      },
    );

    await userEvent.clear($nicknameInput);
    await userEvent.type($nicknameInput, validNickname);

    await step(
      "필수 약관에 동의하지 않은 상태에서 [회원가입] 버튼을 누르면, snackbar가 뜬다.",
      async () => {
        await userEvent.click($submitButton);

        const $snackbar = canvas.getByText(
          userInfoFormErrorMessage.submit.requiredTermsAgreement,
        );
        expect($snackbar).toBeInTheDocument();

        const $snackBarCloseButton = canvas.getByLabelText("스낵바 닫기");

        await userEvent.click($snackBarCloseButton);
        await waitFor(
          () => {
            expect($snackBarCloseButton).not.toBeInTheDocument();
          },
          {
            timeout: 1000,
          },
        );
      },
    );
  },
};

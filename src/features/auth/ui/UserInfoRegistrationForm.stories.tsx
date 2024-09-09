import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { OverlayPortal } from "@/app/OverlayPortal";
import { useAuthStore } from "@/shared/store/auth";
import { userInfoRegistrationHandlers } from "@/mocks/handler";
import { useUserInfoRegistrationFormStore } from "../store";
import UserInfoRegistrationForm from "./UserInfoRegistrationForm";

const meta: Meta<typeof UserInfoRegistrationForm> = {
  title: "features/auth/UserInfoRegistrationForm",
  component: UserInfoRegistrationForm,
  tags: ["autodocs"],
  args: {},
  argTypes: {},
  decorators: (Story) => {
    return (
      <div id="root">
        <OverlayPortal />
        <div className="w-96">
          <Story />
        </div>
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof UserInfoRegistrationForm>;

export const Default: Story = {
  decorators: (Story) => {
    useUserInfoRegistrationFormStore.setState({
      nickname: "",
      gender: null,
      ageRange: null,
      region: null,
      checkList: [false, false, false],
    });

    useAuthStore.setState({
      token: "Bearer token",
    });

    return <Story />;
  },

  render: () => <UserInfoRegistrationForm />,

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const $nicknameInput = canvasElement.querySelector(
      'input[name="nickname"]',
    ) as HTMLInputElement;
    const validNickname = "hihihi";
    const invalidNickname = "!!@#$@";

    const $submitButton = canvas.getByText("회원가입");

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
          await userEvent.type($nicknameInput, invalidNickname);
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
          await userEvent.type($nicknameInput, validNickname);

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

      await step("닉네임이 store에 저장된다.", async () => {
        const { nickname } = useUserInfoRegistrationFormStore.getState();
        expect(nickname).toEqual(validNickname);
      });
    });

    await step("gender select 검사", async () => {
      const $genderLabel = canvas.getByText("성별");
      const $genderTriggerButton = canvasElement.querySelector("#gender");

      await step(
        "성별을 선택하지 않은 상태에서 [회원가입] 버튼을 누르면, snackbar가 뜬다.",
        async () => {
          await userEvent.click($submitButton);

          const $snackbar = canvas.getByText("필수 항목을 모두 입력해 주세요");
          expect($snackbar).toBeInTheDocument();

          const $snackBarCloseButton = canvas.getByLabelText("스낵바 닫기");

          await userEvent.click($snackBarCloseButton);
          await expect($snackBarCloseButton).not.toBeInTheDocument();
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

      await step("성별이 store에 저장된다.", async () => {
        const { gender } = useUserInfoRegistrationFormStore.getState();
        expect(gender).toEqual("MALE");
      });
    });

    await step("age range select 검사", async () => {
      const $ageRangeLabel = canvas.getByText("연령대");
      const $ageRangeTriggerButton = canvasElement.querySelector("#age-range");

      await step(
        "연령대를 선택하지 않은 상태에서 [회원가입] 버튼을 누르면, snackbar가 뜬다.",
        async () => {
          await userEvent.click($submitButton);

          const $snackbar = canvas.getByText("필수 항목을 모두 입력해 주세요");
          expect($snackbar).toBeInTheDocument();

          const $snackBarCloseButton = canvas.getByLabelText("스낵바 닫기");

          await userEvent.click($snackBarCloseButton);
          await expect($snackBarCloseButton).not.toBeInTheDocument();
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

      await step("연령대가 store에 저장된다.", async () => {
        const { ageRange } = useUserInfoRegistrationFormStore.getState();
        expect(ageRange).toEqual(10);
      });
    });

    // todo: 동네 설정 검사

    await step(
      "form을 다 입력했지만 이메일 형식에 맞지 않은 상태에서 [회원가입] 버튼을 누르면, snackbar가 뜬다.",
      async () => {
        await userEvent.clear($nicknameInput);

        await userEvent.type($nicknameInput, invalidNickname);
        await userEvent.click($submitButton);

        const $snackbar = canvas.getByText("올바른 닉네임을 입력해 주세요");
        expect($snackbar).toBeInTheDocument();

        const $snackBarCloseButton = canvas.getByLabelText("스낵바 닫기");

        await userEvent.click($snackBarCloseButton);
        await expect($snackBarCloseButton).not.toBeInTheDocument();
      },
    );

    await userEvent.clear($nicknameInput);
    await userEvent.type($nicknameInput, validNickname);

    // todo: 유저 중복 snackbar 검사

    await step(
      "필수 약관에 동의하지 않은 상태에서 [회원가입] 버튼을 누르면, snackbar가 뜬다.",
      async () => {
        await userEvent.click($submitButton);

        const $snackbar = canvas.getByText("필수 약관에 모두 동의해 주세요");
        expect($snackbar).toBeInTheDocument();

        const $snackBarCloseButton = canvas.getByLabelText("스낵바 닫기");

        await userEvent.click($snackBarCloseButton);
        await expect($snackBarCloseButton).not.toBeInTheDocument();
      },
    );
  },
};

export const ApiTest: Story = {
  decorators: (Story) => {
    useAuthStore.setState({
      token: "Bearer token",
    });

    useUserInfoRegistrationFormStore.setState({
      nickname: "",
      gender: null,
      ageRange: null,
      region: null,
      checkList: [false, false, false],
    });

    return <Story />;
  },

  render: () => <UserInfoRegistrationForm />,

  parameters: {
    msw: {
      handlers: userInfoRegistrationHandlers,
    },
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const $nicknameInput = canvasElement.querySelector(
      'input[name="nickname"]',
    ) as HTMLInputElement;

    const $genderTriggerButton = canvasElement.querySelector("#gender");
    const $ageRangeTriggerButton = canvasElement.querySelector("#age-range");

    const $firstAgreementCheckbox = canvas.getByText("이용약관 동의 (필수)");
    const $secondAgreementCheckbox = canvas.getByText(
      "개인정보 수집 및 이용 동의 (필수)",
    );

    const $submitButton = canvas.getByText("회원가입");

    await step(
      "form을 올바르게 입력하고 필수 약관에 동의한 상태에서 [회원가입] 버튼을 누르면, nickname과 role을 store에 저장된다.",
      async () => {
        const validNickname = "hihihi";
        await userEvent.type($nicknameInput, validNickname);

        await userEvent.click($genderTriggerButton!);

        const $bottomSheet = document.querySelector("#gender-select");
        const $optionList = $bottomSheet?.querySelectorAll("li");
        const $maleOption = $optionList?.[0];
        await userEvent.click($maleOption!);

        await userEvent.click($ageRangeTriggerButton!);

        const $ageRangeBottomSheet =
          document.querySelector("#age-range-select");
        const $ageRangeOptionList =
          $ageRangeBottomSheet?.querySelectorAll("li");
        const $teenagerOption = $ageRangeOptionList?.[0];
        await userEvent.click($teenagerOption!);

        await userEvent.click($firstAgreementCheckbox);
        await userEvent.click($secondAgreementCheckbox);

        await userEvent.click($submitButton);

        await waitFor(() => {
          const { nickname, role } = useAuthStore.getState();

          expect(role).toBe("ROLE_GUEST");
          expect(nickname).toBe(validNickname);
        });
      },
    );
  },
};

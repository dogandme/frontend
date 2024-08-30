import { Meta, StoryObj } from "@storybook/react";
import { LoginForm } from ".";
import { within, userEvent, expect } from "@storybook/test";
const meta: Meta<typeof LoginForm> = {
  title: "features/auth/LoginForm",
};

export default meta;

export const Default: StoryObj<typeof LoginForm> = {
  decorators: [
    (Story) => (
      <div className="w-96 border border-grey-300 px-2 py-2">
        <Story />
      </div>
    ),
  ],

  render: () => (
    <LoginForm.Form>
      <LoginForm.Email />
      <LoginForm.Password />
      <LoginForm.PersistLogin />
      <LoginForm.SubmitButton />
    </LoginForm.Form>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $input = canvas.getByLabelText("이메일-input");
    const $p = await canvas.findByRole("status", { name: "status-text" });
    const $submit = await canvas.getByRole("submit", {
      name: "login-submit-button",
    });

    const DEFAULT_STATUS_TEXT = "이메일 형식으로 입력해 주세요";
    const EMPTY_STATUS_TEXT = "이메일 형식으로 입력해 주세요";
    const ERROR_STATUS_TEXT = "올바른 이메일 형식으로 입력해 주세요";

    await step(
      "인풋 필드가 포커스 되어 있지 않는 경우에 p 태그는 돔에 존재해야 한다.",
      () => {
        expect($p).toBeInTheDocument();
      },
    );

    await step(
      "인풋 필드가 포커스 되어 있지 않은 경우에 p 태그는 문자를 가지면 안된다.",
      () => {
        expect($p).toHaveTextContent("");
      },
    );

    await step(
      "인풋 필드가 포커스 되면 p 태그의 문자는 이메일 형식으로 입력해 주세요 라는 안내 문구가 떠야 한다. ",
      async () => {
        await userEvent.click($input);
        expect($p).toHaveTextContent(EMPTY_STATUS_TEXT);
      },
    );

    await step(
      "이메일 유효성 검사를 통과하지 않는 문자가 나타나면 p 태그의 문자열은 올바른 이메일 형식으로 입력해 주세요 라는 안내 문구가 떠야 한다.",
      async () => {
        await userEvent.type($input, "test");
        expect($p).toHaveTextContent(ERROR_STATUS_TEXT);
      },
    );

    await step(
      "이메일 유효성 검사를 통과하는 문자가 나타나면 p 태그의 문자열은 빈 문자열이 되어야 한다.",
      async () => {
        await userEvent.type($input, "test123@naver.com");
        expect($p).toHaveTextContent("");
      },
    );

    await step(
      "인풋 필드가 비어 있으면 p 태그의 문자열은 이메일 형식으로 입력해 주세요 라는 안내 문구가 떠야 한다.",
      async () => {
        await userEvent.clear($input);
        expect($p).toHaveTextContent(DEFAULT_STATUS_TEXT);
      },
    );

    // window.alert 목업하기
    const originalAlert = window.alert;
    let alertCalled = false;
    window.alert = () => {
      alertCalled = true;
    };
    // TODO 스낵바로 변경하여 테스트 하기
    await step("유효성을 만족하지 않으면 alert 창이 떠야 한다.", async () => {
      await userEvent.click($submit);
      expect(alertCalled).toBe(true);
    });
    window.alert = originalAlert;
  },
};

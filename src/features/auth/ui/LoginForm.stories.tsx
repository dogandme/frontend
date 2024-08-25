import { Meta, StoryObj } from "@storybook/react";
import LoginForm from "./LoginForm";
import { within, userEvent, expect } from "@storybook/test";

const meta: Meta<typeof LoginForm> = {
  title: "features/auth/LoginForm",
  component: LoginForm,
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

  render: () => <LoginForm />,

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $input = canvas.getByLabelText("이메일-input");
    const $p = await canvas.findByRole("status", { name: "status-text" });

    const DELTA = 100;
    const DELAY = 500 + DELTA;
    const EMPTY_STATUS_TEXT = "이메일 형식으로 입력해 주세요";
    const ERROR_STATUS_TEXT = "올바른 이메일 형식으로 입력해 주세요";

    const ERROR_TEXT_COLOR = "text-pink-500";
    const DEFAULT_TEXT_COLOR = "text-grey-500";

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

    await userEvent.click($input);
    await step(
      "인풋 필드가 포커스 되면 p 태그의 문자는 이메일 형식으로 입력해 주세요 라는 안내 문구가 떠야 한다. ",
      () => {
        expect($p).toHaveTextContent(EMPTY_STATUS_TEXT);
        expect($p).toHaveClass(DEFAULT_TEXT_COLOR);
      },
    );

    await step(
      "인풋 필드에서 입력이 되는 동안엔 유효성 검사가 일어나면 안된다.",
      async () => {
        await userEvent.type($input, "test");
        expect($p).toHaveTextContent(EMPTY_STATUS_TEXT);
        expect($p).toHaveClass(DEFAULT_TEXT_COLOR);
      },
    );

    await step(
      "인풋 필드에서 입력이 일어나고 DELAY 이후에 유효성 검사가 일어나야 한다.",
      async () => {
        await new Promise((resolve) => setTimeout(resolve, DELAY));
        expect($p).toHaveTextContent(ERROR_STATUS_TEXT);
        expect($p).toHaveClass(ERROR_TEXT_COLOR);
      },
    );

    await step(
      "인풋 필드에서 이메일 형식으로 입력이 되는 동안엔 유효성 검사가 일어나면 안된다.",
      async () => {
        await userEvent.type($input, "test123@naver.com");
        expect($p).toHaveTextContent(ERROR_STATUS_TEXT);
        expect($p).toHaveClass(ERROR_TEXT_COLOR);
      },
    );

    await step(
      "인풋 필드에서 이메일 형식으로 입력이 모두 끝나고 DELAY 이후에 유효성 검사가 일어나야 한다.",
      async () => {
        await new Promise((resolve) => setTimeout(resolve, DELAY));
        expect($p).toHaveTextContent("");
        expect($p).toHaveClass(DEFAULT_TEXT_COLOR);
      },
    );

    await step(
      "인풋 필드에서 유효한 이메일 형태에서 유효성을 만족하지 않는 문자열로 변경되는 동안에도 유효성 검사는 일어나면 안된다.",
      async () => {
        await userEvent.type(
          $input,
          "{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}",
        );
        expect($p).toHaveTextContent("");
        expect($p).toHaveClass(DEFAULT_TEXT_COLOR);
      },
    );

    await step(
      "인풋 필드에서 유효한 이메일 형태에서 유효성을 만족하지 않는 문자열로 변경되고 DELAY 이후에 유효성 검사가 일어나야 한다.",
      async () => {
        await new Promise((resolve) => setTimeout(resolve, DELAY));
        expect($p).toHaveTextContent(ERROR_STATUS_TEXT);
      },
    );

    await step(
      "인풋 필드가 모두 지워지고 DELAY 만큼의 시간이 지나면 statusText는 다시 초기 상태의 값을 가져야 한다.",
      async () => {
        await userEvent.clear($input);
        await new Promise((resolve) => setTimeout(resolve, DELAY));
        expect($p).toHaveTextContent(EMPTY_STATUS_TEXT);
      },
    );

    await step(
      "인풋 필드가 포커스 되어 있지 않는 경우에 DELAY 여부와 상관 없이 p 태그는 문자를 가지면 안된다.",
      async () => {
        await userEvent.tab();
        expect($p).toHaveTextContent("");
      },
    );
  },
};

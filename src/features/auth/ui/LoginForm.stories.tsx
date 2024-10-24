import { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";
import { useAuthStore } from "@/shared/store/auth";
import { handlers } from "@/mocks/handler";
import { LoginForm } from ".";

const meta: Meta<typeof LoginForm> = {
  title: "features/auth/LoginForm",
  decorators: [
    (Story) => (
      <div className="w-96 border border-grey-300 px-2 py-2">
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Default: StoryObj<typeof LoginForm> = {
  parameters: {
    msw: {
      handlers: [...handlers],
    },
  },

  render: () => (
    <LoginForm.Form>
      <LoginForm.Email />
      <LoginForm.Password />
      <LoginForm.PersistLogin />
      <LoginForm.SubmitButton />
    </LoginForm.Form>
  ),

  play: async ({ canvasElement, step }) => {
    const $input = canvasElement.querySelector("#email")!;
    const $statusText = canvasElement.querySelector("p")!;

    const DEFAULT_STATUS_TEXT = "이메일 형식으로 입력해 주세요";
    const EMPTY_STATUS_TEXT = "이메일 형식으로 입력해 주세요";
    const ERROR_STATUS_TEXT = "올바른 이메일 형식으로 입력해 주세요";

    await step(
      "인풋 필드가 포커스 되어 있지 않는 경우에 statusText를 가리키는 태그는 돔에 존재해야 한다.",
      () => {
        expect($statusText).toBeInTheDocument();
      },
    );

    await step(
      "인풋 필드가 포커스 되어 있지 않은 경우에 statusText를 가리키는 태그는 문자를 가지면 안된다.",
      () => {
        expect($statusText).toHaveTextContent("");
      },
    );

    await step(
      "인풋 필드가 포커스 되면 statusText를 가리키는 태그의 문자는 이메일 형식으로 입력해 주세요 라는 안내 문구가 떠야 한다. ",
      async () => {
        await userEvent.click($input);
        expect($statusText).toHaveTextContent(EMPTY_STATUS_TEXT);
      },
    );

    await step(
      "이메일 유효성 검사를 통과하지 않는 문자가 나타나면 statusText를 가리키는 태그의 문자열은 올바른 이메일 형식으로 입력해 주세요 라는 안내 문구가 떠야 한다.",
      async () => {
        await userEvent.type($input, "test");
        expect($statusText).toHaveTextContent(ERROR_STATUS_TEXT);
      },
    );

    await step(
      "이메일 유효성 검사를 통과하는 문자가 나타나면 statusText를 가리키는 태그의 문자열은 빈 문자열이 되어야 한다.",
      async () => {
        await userEvent.type($input, "test123@naver.com");
        expect($statusText).toHaveTextContent("");
      },
    );

    await step(
      "인풋 필드가 비어 있으면 statusText를 가리키는 태그의 문자열은 이메일 형식으로 입력해 주세요 라는 안내 문구가 떠야 한다.",
      async () => {
        await userEvent.clear($input);
        expect($statusText).toHaveTextContent(DEFAULT_STATUS_TEXT);
      },
    );
  },
};

const ApiTestComponent = () => {
  return (
    <>
      <LoginForm.Form>
        <LoginForm.Email />
        <LoginForm.Password />
        <LoginForm.PersistLogin />
        <LoginForm.SubmitButton />
      </LoginForm.Form>
    </>
  );
};

export const APISuccessTest: StoryObj<typeof LoginForm> = {
  decorators: (Story) => {
    // 스토리 시작 전 스토어 초기화
    useAuthStore.setState({
      token: null,
      role: null,
      nickname: null,
    });
    return <Story />;
  },
  render: () => <ApiTestComponent />,
  parameters: {
    ...Default.parameters,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $input = canvasElement.querySelector("#email")!;
    const $password = canvasElement.querySelector("#password")!;
    const $submit = canvas.getByText("로그인");

    await step("API 요청이 일어나기 전까지 토큰은 존재하지 않는다.", () => {
      const { token, role, nickname } = useAuthStore.getState();
      expect(token).toBe(null);
      expect(role).toBe(null);
      expect(nickname).toBe(null);
    });

    await userEvent.type($input, "user123@naver.com");
    await userEvent.type($password, "password");
    await userEvent.click($submit);

    await step("API 요청이 일어난 후에는 토큰에 값이 존재한다.", async () => {
      // 목업된 API 데이터를 받기 위한 딜레이 설정
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { token, role, nickname } = useAuthStore.getState();
      expect(token).toBe("Bearer token");
      expect(role).toBe("USER_USER");
      expect(nickname).toBe("뽀송이");
    });
  },
};

export const APIFailedTest: StoryObj<typeof LoginForm> = {
  decorators: (Story) => {
    // 스토리 시작 전 스토어 초기화
    useAuthStore.setState({
      token: null,
      role: null,
      nickname: null,
    });
    return <Story />;
  },
  render: () => <ApiTestComponent />,
  parameters: {
    ...Default.parameters,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $input = canvasElement.querySelector("#email")!;
    const $password = canvasElement.querySelector("#password")!;
    const $submit = canvas.getByText("로그인");

    await step("API 요청이 일어나기 전까지 토큰은 존재하지 않는다.", () => {
      const { token, role, nickname } = useAuthStore.getState();
      expect(token).toBe(null);
      expect(role).toBe(null);
      expect(nickname).toBe(null);
    });

    await step("API 요청이 실패한 경우엔 상태가 변경되지 않는다.", async () => {
      await userEvent.type($input, "wrongUser@naver.com");
      await userEvent.type($password, "password");
      await userEvent.click($submit);
      // 목업된 API 데이터를 받기 위한 딜레이 설정
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { token, role, nickname } = useAuthStore.getState();
      expect(token).toBe(null);
      expect(role).toBe(null);
      expect(nickname).toBe(null);
    });
  },
};

import { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";
import { useAuthStore } from "@/shared/store/auth";
import { handlers } from "@/mocks/handler";
import { LoginForm } from ".";
import { loginErrorMessage } from "../constants";

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
    msw: { handlers },
  },

  render: () => <LoginForm />,

  play: async ({ canvasElement, step }) => {
    const $input = canvasElement.querySelector("#email")!;
    const $statusText = canvasElement.querySelector("p")!;

    await step(
      `이메일 유효성 검사를 통과하지 않는 문자가 나타나면, '${loginErrorMessage.email.pattern}' 안내 문구가 떠야 한다.`,
      async () => {
        await userEvent.type($input, "test");
        expect($statusText).toHaveTextContent(loginErrorMessage.email.pattern);
      },
    );

    await step(
      "이메일 유효성 검사를 통과하는 문자가 나타나면, 안내 문구가 사라진다.",
      async () => {
        await userEvent.type($input, "test123@naver.com");
        expect($statusText).toHaveTextContent("");
      },
    );

    await step(
      `인풋 필드가 비어 있으면, '${loginErrorMessage.email.required}' 라는 안내 문구가 떠야 한다.`,
      async () => {
        await userEvent.clear($input);
        expect($statusText).toHaveTextContent(loginErrorMessage.email.required);
      },
    );
  },
};

const ApiTestComponent = () => {
  return <LoginForm />;
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
      expect(token).toBe("accessToken-ROLE_USER");
      expect(role).toBe("ROLE_USER");
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

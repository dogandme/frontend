import { http, HttpResponse } from "msw";
import { Meta, StoryObj } from "@storybook/react";
import { LoginForm } from ".";
import { within, userEvent, expect } from "@storybook/test";
import { useAuthStore } from "@/shared/store/auth";
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
    const $input = canvasElement.querySelector("#email")!;
    const $p = canvasElement.querySelector("p")!;
    const $submit = canvas.getByText("로그인")!;

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
    msw: {
      handlers: [
        http.post("http://localhost/login", () => {
          return HttpResponse.json({
            code: 200,
            message: "success",
            content: {
              authorization: "Bearer token",
              role: "USER_USER",
              nickname: "뽀송이",
              userId: 1234,
            },
          });
        }),
      ],
    },
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

    await userEvent.type($input, "abcd123@naver.com");
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
    msw: {
      handlers: [
        http.post("http://localhost/login", () => {
          return HttpResponse.json({
            code: 401,
            message: "아이디 또는 비밀번호를 다시 확인해 주세요",
            content: {
              authorization: null,
              role: null,
              nickname: null,
              userId: null,
            },
          });
        }),
      ],
    },
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
      // window.alert 목업하기
      const originalAlert = window.alert;
      let alertMessage;
      window.alert = (message) => {
        alertMessage = message;
      };

      await userEvent.type($input, "abcd123@naver.com");
      await userEvent.type($password, "password");
      await userEvent.click($submit);
      // 목업된 API 데이터를 받기 위한 딜레이 설정
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { token, role, nickname } = useAuthStore.getState();
      expect(token).toBe(null);
      expect(role).toBe(null);
      expect(nickname).toBe(null);

      expect(alertMessage).toEqual("아이디 또는 비밀번호를 다시 확인해 주세요");
      window.alert = originalAlert;
    });
  },
};

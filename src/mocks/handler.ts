import { http, HttpResponse, PathParams } from "msw";

export const signUpByEmailHandlers = [
  http.post<
    PathParams,
    {
      email: string;
    }
  >("http://localhost/users/auth", async ({ request }) => {
    const { email } = await request.json();

    const isDuplicateEmail = email === "중복";

    if (isDuplicateEmail) {
      return new HttpResponse(null, { status: 409 });
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
  http.post<
    PathParams,
    {
      email: string;
      authNum: string;
    }
  >("http://localhost/users/auth/check", async ({ request }) => {
    const { authNum } = await request.json();

    if (authNum === "1111111") {
      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    }

    return new HttpResponse(null, { status: 401 });
  }),
  http.post<
    PathParams,
    {
      email: string;
      password: string;
    }
  >("http://localhost/users", async ({ request }) => {
    const { email } = await request.json();

    if (email === "중복") {
      return new HttpResponse(null, { status: 409 });
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        authorization: "token",
        role: "ROLE_NONE",
      },
    });
  }),
];

export const userInfoRegistrationHandlers = [
  http.put<
    PathParams,
    {
      nickname: string;
      gender: "FEMALE" | "MALE";
      age: 10 | 20 | 30 | 40 | 50;
      region: string;
      marketingYn: boolean;
    }
  >("http://localhost/users/additional-info", async ({ request }) => {
    const { nickname } = await request.json();

    const isDuplicateNickname = nickname === "중복";

    if (isDuplicateNickname) {
      return new HttpResponse(null, { status: 409 });
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        nickname,
        role: "ROLE_GUEST",
      },
    });
  }),
];

// * 나중에 msw 사용을 대비하여 만들었습니다.
export const handlers = [
  ...signUpByEmailHandlers,
  ...userInfoRegistrationHandlers,
];

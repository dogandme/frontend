import { http, HttpResponse, PathParams } from "msw";

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
export const handlers = [...userInfoRegistrationHandlers];

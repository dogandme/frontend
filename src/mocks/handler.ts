import { http, HttpResponse, PathParams } from "msw";

export const signUpByEmailHandlers = [
  http.post<
    PathParams,
    {
      email: string;
    }
  >("http://localhost/users/auth", async ({ request }) => {
    const { email } = await request.json();

    const isDuplicateEmail = email === "hihihi@naver.com";

    if (isDuplicateEmail) {
      return HttpResponse.json(
        {
          code: 409,
          message: "FAIL",
        },
        { status: 409, statusText: "Conflict" },
      );
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

    if (email === "hihihi@naver.com") {
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

  http.post<
    PathParams,
    {
      nickname: string;
    }
  >("http://localhost/users/nickname", async ({ request }) => {
    const { nickname } = await request.json();

    if (nickname === "중복") {
      return new HttpResponse(null, { status: 409 });
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
];

let previousUrl: string = "";

export const markingModalHandlers = [
  http.get<PathParams>(
    "http://localhost/maps/reverse-geocoding",
    async ({ request }) => {
      const requestUrl = new URL(request.url);
      const lat = requestUrl.searchParams.get("lat");
      const lng = requestUrl.searchParams.get("lng");

      if (!lat || !lng) {
        throw new Error("lat, lng 값이 없습니다.");
      }

      if (previousUrl && previousUrl !== request.url) {
        previousUrl = request.url;
        return HttpResponse.json({
          code: 200,
          message: "success",
          content: {
            region: "서울특별시 강남구 압구정동 789-123",
          },
        });
      }

      return HttpResponse.json({
        code: 200,
        message: "success",
        content: {
          region: "서울특별시 강남구 역삼동 123-456",
        },
      });
    },
  ),
  http.post<PathParams>("http://localhost/markings", async () => {
    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
  http.post<PathParams>("http://localhost/markings/temp", async () => {
    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
];

// * 나중에 msw 사용을 대비하여 만들었습니다.
export const handlers = [
  ...signUpByEmailHandlers,
  ...userInfoRegistrationHandlers,
];

import { http, HttpResponse, PathParams } from "msw";
import { LOGIN_END_POINT, SIGN_UP_END_POINT } from "@/features/auth/constants";
import { MarkingListRequest } from "@/features/marking/api";
import { MARKING_REQUEST_URL } from "@/features/marking/constants";
// data
import markingListData from "./data/markingList.json";

export const signUpByEmailHandlers = [
  http.post<
    PathParams,
    {
      email: string;
    }
  >(SIGN_UP_END_POINT.VERIFICATION_CODE, async ({ request }) => {
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
  >(SIGN_UP_END_POINT.CHECK_VERIFICATION_CODE, async ({ request }) => {
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
  >(SIGN_UP_END_POINT.EMAIL, async ({ request }) => {
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
  >(SIGN_UP_END_POINT.USER_INFO, async ({ request }) => {
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
  >(SIGN_UP_END_POINT.DUPLICATE_NICKNAME, async ({ request }) => {
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

export const markingModalHandlers = [
  http.get<PathParams>(
    `${import.meta.env.VITE_API_BASE_URL}/maps/reverse-geocode`,
    async ({ request }) => {
      const requestUrl = new URL(request.url);
      const lat = requestUrl.searchParams.get("lat");
      const lng = requestUrl.searchParams.get("lng");

      if (!lat || !lng) {
        return HttpResponse.json(
          {
            code: 400,
            menubar: "위경도 값을 입력해 주세요",
          },
          {
            status: 400,
            statusText: "Bad Request",
          },
        );
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
  http.post<PathParams>(MARKING_REQUEST_URL.ADD, async () => {
    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
  http.post<PathParams>(MARKING_REQUEST_URL.SAVE_TEMP, async () => {
    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),

  http.get<{
    [K in keyof Omit<MarkingListRequest, "token">]: string;
  }>(
    `${import.meta.env.VITE_API_BASE_URL}/markings/search`,
    async ({ request }) => {
      const token = request.headers.get("Authorization");

      if (token) {
        return HttpResponse.json(
          {
            code: 200,
            message: "success",
            content: markingListData.member,
          },
          { status: 200, statusText: "success" },
        );
      }

      return HttpResponse.json(
        {
          code: 200,
          message: "success",
          content: markingListData.notMember,
        },
        { status: 200, statusText: "success" },
      );
    },
  ),
];

export const loginHandlers = [
  http.post<
    PathParams,
    {
      email: string;
      password: string;
    }
  >(LOGIN_END_POINT.EMAIL, async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    if (email === "user123@naver.com" && password === "password") {
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
    }
    return HttpResponse.json(
      {
        code: 401,
        message: "아이디 또는 비밀번호를 다시 확인해 주세요",
      },
      {
        status: 401,
      },
    );
  }),
];

// * 나중에 msw 사용을 대비하여 만들었습니다.
export const handlers = [
  ...signUpByEmailHandlers,
  ...userInfoRegistrationHandlers,
  ...markingModalHandlers,
  ...loginHandlers,
];

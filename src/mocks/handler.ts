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
        authorization: "Bearer token-for-role-guest",
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

    if (email === "userNone123@naver.com" && password === "password") {
      return HttpResponse.json({
        code: 200,
        message: "success",
        content: {
          authorization: "Bearer token",
          role: "ROLE_NONE",
          nickname: null,
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

export const profileHandlers = [
  http.get(
    `${import.meta.env.VITE_API_BASE_URL}/profile`,
    async ({ request }) => {
      const requestUrl = new URL(request.url);
      const nickname = requestUrl.searchParams.get("nickname");

      // UserInfoRegistrationForm 에서 사용 될 핸들러 입니다.
      if (nickname === "hihi") {
        return HttpResponse.json({
          code: 200,
          message: "success",
          content: {
            nickname: "hihi",
            pet: null,
            followers: [],
            followings: [],
            likes: [],
            bookmarks: [],
            tempCnt: 0,
          },
        });
      }

      // PetInfoForm 에서 사용 될 핸들러 입니다.
      if (nickname === "뽀송송") {
        return HttpResponse.json({
          code: 200,
          message: "success",
          content: {
            nickname: "뽀송송",
            pet: {
              name: "초코",
              breed: "푸들",
              description: "안녕하세요 너무 귀여운 강아지 입니다.",
              personalities: ["호기심 많은", "애착이 강한"],
              profile:
                "https://images.unsplash.com/photo-1551316679-9c6ae9dec224",
            },
          },
        });
      }
    },
  ),
];

export const addressHandlers = [
  http.get("http://localhost/addresses", (req) => {
    const {
      request: { url },
    } = req;

    const URLObject = new URL(url);
    const keyword = URLObject.searchParams.get("keyword");

    if (keyword === "강남구 역삼동") {
      return HttpResponse.json({
        code: 200,
        message: "good",
        content: [
          {
            id: 0,
            province: "서울특별시",
            cityCounty: "강남구",
            subDistrict: "역삼1동",
            district: "123-45",
          },
          {
            id: 1,
            province: "서울특별시",
            cityCounty: "강남구",
            subDistrict: "역삼2동",
            district: "123-45",
          },
          {
            id: 2,
            province: "서울특별시",
            cityCounty: "강남구",
            subDistrict: "역삼3동",
            district: "123-45",
          },
          {
            id: 3,
            province: "서울특별시",
            cityCounty: "강남구",
            subDistrict: "역삼4동",
            district: "123-45",
          },
          {
            id: 4,
            province: "서울특별시",
            cityCounty: "강남구",
            subDistrict: "역삼5동",
            district: "123-45",
          },
          {
            id: 5,
            province: "서울특별시",
            cityCounty: "강남구",
            subDistrict: "역삼6동",
            district: "123-45",
          },
          {
            id: 6,
            province: "서울특별시",
            cityCounty: "강남구",
            subDistrict: "역삼7동",
            district: "123-45",
          },
        ],
      });
    }

    if (keyword === "도봉구 도봉동") {
      return HttpResponse.json({
        code: 200,
        message: "good",
        content: [
          {
            id: 0,
            province: "서울특별시",
            cityCounty: "도봉구",
            subDistrict: "도봉1동",
            district: "123-45",
          },
          {
            id: 1,
            province: "서울특별시",
            cityCounty: "도봉구",
            subDistrict: "도봉2동",
            district: "123-45",
          },
          {
            id: 2,
            province: "서울특별시",
            cityCounty: "도봉구",
            subDistrict: "도봉3동",
            district: "123-45",
          },
          {
            id: 3,
            province: "서울특별시",
            cityCounty: "도봉구",
            subDistrict: "도봉4동",
            district: "123-45",
          },
        ],
      });
    }

    return HttpResponse.json({
      code: 204, // 검색 결과 없을 시를 가정
      message: "bad",
      content: [],
    });
  }),
  http.get("http://localhost/addresses/search-by-location", () => {
    return HttpResponse.json({
      code: 200,
      message: "good",
      content: [
        {
          id: 0,
          province: "서울특별시",
          cityCounty: "영등포구",
          subDistrict: "영등포 1가",
          district: "123-45",
        },
        {
          id: 1,
          province: "서울특별시",
          cityCounty: "영등포구",
          subDistrict: "영등포 2가",
          district: "123-45",
        },
        {
          id: 2,
          province: "서울특별시",
          cityCounty: "영등포구",
          subDistrict: "영등포 3가",
          district: "123-45",
        },
        {
          id: 3,
          province: "서울특별시",
          cityCounty: "영등포구",
          subDistrict: "영등포 4가",
          district: "123-45",
        },
        {
          id: 4,
          province: "서울특별시",
          cityCounty: "영등포구",
          subDistrict: "영등포 5가",
          district: "123-45",
        },
        {
          id: 5,
          province: "서울특별시",
          cityCounty: "영등포구",
          subDistrict: "영등포 6가",
          district: "123-45",
        },
        {
          id: 6,
          province: "서울특별시",
          cityCounty: "영등포구",
          subDistrict: "영등포 7가",
          district: "123-45",
        },
      ],
    });
  }),
];

// * 나중에 msw 사용을 대비하여 만들었습니다.
export const handlers = [
  ...signUpByEmailHandlers,
  ...userInfoRegistrationHandlers,
  ...markingModalHandlers,
  ...loginHandlers,
  ...profileHandlers,
  ...addressHandlers,
];

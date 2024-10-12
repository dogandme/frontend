import { http, HttpResponse, PathParams } from "msw";
import { ERROR_MESSAGE } from "@/app/ReactQueryProvider/constants";
import { APP_END_POINT } from "@/app/ReactQueryProvider/constants";
import { LOGIN_END_POINT, SIGN_UP_END_POINT } from "@/features/auth/constants";
import { MarkingListRequest } from "@/features/marking/api";
import { MARKING_REQUEST_URL } from "@/features/marking/constants";
import { SETTING_END_POINT } from "@/features/setting/constants";
import { MY_INFO_END_POINT } from "@/entities/auth/constants";
import { API_BASE_URL } from "@/shared/constants";
import User from "../mocks/data/user.json";
// data
import markingListData from "./data/markingList.json";
import userInfoData from "./data/myInfo.json";
import regionListData from "./data/regionList.json";

interface UserInfo {
  nickname: string;
  pet: {
    name: string;
    breed: string;
    description: string;
    personalities: string[];
    profile: string;
  } | null;
  followers: number[];
  followings: number[];
  likes: number[];
  bookmarks: number[];
  tempCnt: number;
  markings: { id: number; image: string }[];
}

interface UserDB {
  [key: string]: UserInfo;
}

const userDB: UserDB = {};

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

    return HttpResponse.json(
      {
        code: 200,
        message: "success",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "Authorization-refresh=ROLE_NONE; Path=/; Max-Age=60",
        },
      },
    );
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

    userDB[nickname] = {
      nickname,
      pet: null,
      followers: [],
      followings: [],
      likes: [],
      bookmarks: [],
      tempCnt: 0,
      markings: [],
    };

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        nickname,
        authorization: "Bearer token-for-role-guest",
        role: "ROLE_GUEST",
      },
    });
    return HttpResponse.json(
      {
        code: 200,
        message: "success",
        content: {
          nickname,
          role: "ROLE_GUEST",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "Authorization-refresh=ROLE_GUEST; Path=/; Max-Age=60",
        },
      },
    );
  }),

  http.post<
    PathParams,
    {
      nickname: string;
    }
  >(SIGN_UP_END_POINT.DUPLICATE_NICKNAME, async ({ request }) => {
    const { nickname } = await request.json();

    if (nickname === "중복" || userDB[nickname]) {
      return new HttpResponse(null, { status: 409 });
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),

  http.get(MY_INFO_END_POINT, async ({ request }) => {
    const token = request.headers.get("Authorization");

    if (token === "staleAccessToken") {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: userInfoData,
    });
  }),
];

export const markingModalHandlers = [
  http.get<PathParams>(
    `${API_BASE_URL}/maps/reverse-geocode`,
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
  http.post<PathParams>(MARKING_REQUEST_URL.ADD, async ({ request }) => {
    /**
     * 2024/10/07 access token에 대한 테스트 로직을 추가 합니다.
     */
    const token = request.headers.get("Authorization");
    if (token === "staleAccessToken") {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
  http.get<{
    [K in keyof Omit<MarkingListRequest, "token">]: string;
  }>(`${API_BASE_URL}/markings/search`, async ({ request }) => {
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
  }),
  http.delete<PathParams>(MARKING_REQUEST_URL.DELETE, () => {
    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
  http.post<PathParams>(`${API_BASE_URL}/markings/like`, () => {
    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
  http.delete<PathParams>(`${API_BASE_URL}/markings/like`, () => {
    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
  http.post<PathParams>(`${API_BASE_URL}/markings/saves`, () => {
    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
  http.delete<PathParams>(`${API_BASE_URL}/markings/saves`, () => {
    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
  http.post<PathParams>(MARKING_REQUEST_URL.SAVE_TEMP, async ({ request }) => {
    /**
     * 2024/10/07 access token에 대한 테스트 로직을 추가 합니다.
     */
    const token = request.headers.get("Authorization");
    if (token === "staleAccessToken") {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }
    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
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

export const getProfileHandlers = [
  http.get(`${API_BASE_URL}/profile`, async ({ request }) => {
    const requestUrl = new URL(request.url);
    const nickname = requestUrl.searchParams.get("nickname");
    // 2024/10/05 AccessToken 검증 로직을 추가 합니다.
    const token = request.headers.get("Authorization");
    if (token === "staleAccessToken") {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }
    if (token === "freshAccessToken" && nickname === "뽀송송") {
      return HttpResponse.json(User["ROLE_USER"]);
    }

    const userInfo = userDB[nickname as string];
    if (!userInfo) {
      return HttpResponse.json(
        {
          code: 404,
          message: "해당하는 유저를 찾을 수 없습니다.",
        },
        {
          status: 404,
          statusText: "Not Found",
        },
      );
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: userInfo,
    });
  }),
];

export const addressHandlers = [
  http.get(`${API_BASE_URL}/addresses`, (req) => {
    const {
      request: { url },
    } = req;

    const URLObject = new URL(url);
    const keyword = URLObject.searchParams.get("keyword");

    if (keyword === "강남구 역삼동") {
      return HttpResponse.json({
        code: 200,
        message: "good",
        content: regionListData["GANG-NAM"],
      });
    }

    if (keyword === "도봉구 도봉동") {
      return HttpResponse.json({
        code: 200,
        message: "good",
        content: regionListData["DOBONG"],
      });
    }

    return HttpResponse.json({
      code: 204, // 검색 결과 없을 시를 가정
      message: "입력하신 주소가 없습니다",
    });
  }),
  http.get(`${API_BASE_URL}/addresses/search-by-location`, () => {
    return HttpResponse.json({
      code: 200,
      message: "good",
      content: regionListData["CURRENT_LOCATION"],
    });
  }),
];

/**
 * 404 에러인 회원을 찾을 수 없습니다는 토큰에서 유저 정보를 조회하는 로직이 msw 에서 구현하기 힘들어 제외했습니다.
 */
export const postLogoutHandlers = [
  http.post(SETTING_END_POINT.LOGOUT, ({ request }) => {
    const token = request.headers.get("Authorization");
    if (!token) {
      return HttpResponse.json(
        {
          code: 401,
          message: "토큰 검증에 실패 했습니다.",
        },
        {
          status: 401,
        },
      );
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
];

/**
 * 실제 서버에선 액세스 토큰에 존재하는 userToken 을 이용해 사용자를 조회합니다.
 * 테스트 환경에서 userToken 을 사용하지 않으니 저흰 테스트 시 항상 닉네임을 뽀송송으로 하기로 약속 합니다.
 */
export const petInfoFormHandlers = [
  http.post<
    PathParams,
    {
      petSignUpDto: {
        name: string;
        breed: string;
        description: string;
        personalities: string[];
      };
      image: string;
    }
  >(SIGN_UP_END_POINT.PET_INFO, async ({ request }) => {
    const formData = await request.formData();

    const petSignUpDto = JSON.parse(formData.get("petSignUpDto") as string);
    const image = formData.get("image") as File;

    const userInfo = userDB["뽀송송"];

    if (!userInfo) {
      return HttpResponse.json(
        {
          code: 404,
          message: "해당하는 유저를 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    const newData = {
      ...userInfo,
      pet: {
        ...petSignUpDto,
        profile: image ? URL.createObjectURL(image) : "/default-image.png",
      },
    };

    userDB["뽀송송"] = newData;

    return HttpResponse.json(
      {
        code: 200,
        message: "success",
        content: {
          role: "ROLE_USER",
          authorization: "Bearer token for ROLE_USER",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "Authorization-refresh=ROLE_USER; Path=/; Max-Age=60",
        },
      },
    );
  }),
];

const getNewAccessTokenHandler = [
  http.get(APP_END_POINT.REFRESH_ACCESS_TOKEN, ({ cookies }) => {
    const refreshToken = cookies["Authorization-refresh"];

    if (refreshToken !== "freshRefreshToken") {
      return HttpResponse.json(
        {
          code: 401,
          message: "RefreshToken 검증에 실패했습니다.",
        },
        {
          status: 401,
        },
      );
    }
    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        authorization: "freshAccessToken",
      },
    });
  }),
];

// * 나중에 msw 사용을 대비하여 만들었습니다.
export const handlers = [
  ...signUpByEmailHandlers,
  ...userInfoRegistrationHandlers,
  ...markingModalHandlers,
  ...loginHandlers,
  ...getProfileHandlers,
  ...addressHandlers,
  ...petInfoFormHandlers,
  ...postLogoutHandlers,
  ...getNewAccessTokenHandler,
];

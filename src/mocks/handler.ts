import { http, HttpResponse, PathParams } from "msw";
import { ERROR_MESSAGE } from "@/app/ReactQueryProvider/constants";
import { APP_END_POINT } from "@/app/ReactQueryProvider/constants";
import {
  CHANGE_USER_INFO_END_POINT,
  LOGIN_END_POINT,
  SIGN_UP_END_POINT,
} from "@/features/auth/constants";
import { GetMarkingListRequestData } from "@/features/marking/api";
import { MARKING_END_POINT } from "@/features/marking/constants";
import { PostChangeRegionRequestData } from "@/features/setting/api";
import type {
  PutChangeAgeRequestData,
  PutChangeGenderRequestData,
  PutChangePetInfoRequestData,
} from "@/features/setting/api";
import { SETTING_END_POINT } from "@/features/setting/constants";
import { MyInfo } from "@/entities/auth/api";
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

interface UserInfoDB {
  [key: string]: MyInfo;
}

const userDB: UserDB = {};

const userInfoDB: UserInfoDB = {
  뽀송송_EMAIL: userInfoData["EMAIL"] as MyInfo,
  뽀송송_NAVER: userInfoData["NAVER"] as MyInfo,
};

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

    const isDuplicateNickname =
      nickname === "중복" || nickname === "뽀" || nickname === "송";

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

    if (
      nickname === "중복" ||
      nickname === "뽀" ||
      nickname === "송" ||
      userDB[nickname]
    ) {
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

    if (token === "freshAccessToken-naver") {
      return HttpResponse.json({
        code: 200,
        message: "success",
        content: userInfoDB["뽀송송_NAVER"],
      });
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: userInfoDB["뽀송송_EMAIL"],
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
  http.post<PathParams>(MARKING_END_POINT.ADD, async ({ request }) => {
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
    [K in keyof Omit<GetMarkingListRequestData, "token">]: string;
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
  http.delete<PathParams>(MARKING_END_POINT.DELETE, () => {
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
  http.post<PathParams>(MARKING_END_POINT.SAVE_TEMP, async ({ request }) => {
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
    if (token?.split("-")[0] === "freshAccessToken" && nickname === "뽀송송") {
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
    await new Promise((res) => setTimeout(res, 1000));
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

const putChangeRegionHandler = [
  http.post<PathParams, PostChangeRegionRequestData>(
    SETTING_END_POINT.CHANGE_REGION,
    async ({ request }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { newIds } = await request.json();

      const token = request.headers.get("Authorization")!;
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

      const newRegions = newIds.map(
        (id) =>
          Object.values(regionListData)
            .flat()
            .find((region) => region.id === id)!,
      );

      userInfoDB[
        token.split("-")[1] === "naver" ? "뽀송송_NAVER" : "뽀송송_EMAIL"
      ].regions = newRegions;

      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    },
  ),
];

export const deleteAccountHandlers = [
  http.delete<PathParams, { password: string }>(
    SETTING_END_POINT.DELETE_ACCOUNT,
    async ({ request }) => {
      await new Promise((res) => setTimeout(res, 1000));
      const token = request.headers.get("Authorization");
      const { password } = await request.json();
      if (!token || token === "staleAccessToken") {
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

      if (password !== "password123!") {
        return HttpResponse.json(
          {
            code: 400,
            message: "입력하신 비밀번호가 맞지 않습니다,",
          },
          {
            status: 400,
          },
        );
      }

      return HttpResponse.json({
        code: 200,
        message: "회원 탈퇴가 완료 되었습니다.",
      });
    },
  ),
];

const putChangeGenderHandler = [
  http.put(SETTING_END_POINT.CHANGE_GENDER, async ({ request }) => {
    await new Promise((res) => setTimeout(res, 1000));

    const token = request.headers.get("Authorization")!;
    const { gender } = (await request.json()) as PutChangeGenderRequestData;
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

    const userKey =
      token.split("-")[1] === "naver" ? "뽀송송_NAVER" : "뽀송송_EMAIL";

    userInfoDB[userKey] = {
      ...userInfoDB[userKey],
      gender,
    };

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }),
];

const putChangePasswordHandler = [
  http.put<PathParams, { password: string; newPw: string; newPwChk: string }>(
    SETTING_END_POINT.CHANGE_PASSWORD,
    async ({ request }) => {
      await new Promise((res) => setTimeout(res, 1000));
      const token = request.headers.get("Authorization");
      const { password, newPw, newPwChk } = await request.json();

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

      if (password !== "password123!") {
        return HttpResponse.json(
          {
            code: 400,
            message: "리스소 접근 권한이 없습니다.",
          },
          {
            status: 400,
          },
        );
      }

      if (newPw !== newPwChk) {
        return HttpResponse.json(
          {
            code: 400,
            message:
              "변경하려는 비밀번호 혹은 입력하신 비밀번호가 올바르지 않습니다.",
          },
          {
            status: 400,
          },
        );
      }

      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    },
  ),
];

export const putSetPasswordHandler = [
  http.put<PathParams, { newPw: string; newPwChk: string }>(
    SETTING_END_POINT.SET_PASSWORD,
    async ({ request }) => {
      await new Promise((res) => setTimeout(res, 1000));

      const token = request.headers.get("Authorization");
      const { newPw, newPwChk } = await request.json();

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

      if (newPw !== newPwChk) {
        return HttpResponse.json(
          {
            code: 400,
            message:
              "변경하려는 비밀번호 혹은 입력하신 비밀번호가 올바르지 않습니다.",
          },
          {
            status: 400,
          },
        );
      }

      /* 가상 DB에서 해당 회원의 isPasswordSet 을 true 로 변경 합니다. */
      userInfoDB["뽀송송_NAVER"].isPasswordSet = true;

      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    },
  ),
];

const putChangeAgeHandler = [
  http.put<PathParams, PutChangeAgeRequestData>(
    SETTING_END_POINT.CHANGE_AGE,
    async ({ request }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { age } = await request.json();

      const token = request.headers.get("Authorization")!;
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

      if (token.split("-")[1] === "naver") {
        userInfoDB["뽀송송_NAVER"].age = age;
      }
      userInfoDB["뽀송송_EMAIL"].age = age;

      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    },
  ),
];

const changeUserInfoHandler = [
  http.put<PathParams, { nickname: string }>(
    CHANGE_USER_INFO_END_POINT.NICKNAME,
    async ({ request }) => {
      await new Promise((res) => setTimeout(res, 1000));

      const { nickname } = await request.json();

      // 서버에서 어떻게 에러처리했는지 물어봐야 함
      if (nickname === "중복" || nickname === "뽀" || nickname === "송") {
        return HttpResponse.json(
          {
            code: 400,
            message: "이미 존재하는 닉네임입니다.",
          },
          {
            status: 400,
          },
        );
      }

      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    },
  ),
];

const putChangePetInformationHandler = [
  http.put<PathParams, PutChangePetInfoRequestData>(
    SETTING_END_POINT.CHANGE_PET_INFO,
    async ({ request }) => {
      await new Promise((res) => setTimeout(res, 1000));
      const token = request.headers.get("Authorization")!;
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

      const formData = await request.formData();
      const petDto = JSON.parse(formData.get("petDto") as string);
      const image = formData.get("image") as File;

      const userInfo = User["ROLE_USER"];
      const newData = {
        ...userInfo,
        content: {
          ...userInfo.content,
          pet: {
            ...petDto,
            // image 있고 isChaProfile true -> 새로운 이미지로 변경
            // image 있고 isChaProfile false -> 불가능한 조건
            // image 없고 isChaProfile false -> 기존 이미지 사용
            // image 없고 isChaProfile true -> 이미지 삭제
            profile: image
              ? petDto.isChaProfile
                ? URL.createObjectURL(image)
                : null // 발생 될 수 없는 조건
              : petDto.isChaProfile
                ? null
                : userInfo.content.pet.profile,
          },
        },
      };
      User["ROLE_USER"] = newData;

      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    },
  ),
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
  ...putChangeRegionHandler,
  ...deleteAccountHandlers,
  ...putChangeGenderHandler,
  ...putChangePasswordHandler,
  ...putSetPasswordHandler,
  ...putChangeAgeHandler,
  ...changeUserInfoHandler,
  ...putChangePetInformationHandler,
];

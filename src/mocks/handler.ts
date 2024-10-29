import { http, HttpResponse, PathParams } from "msw";
import { ERROR_MESSAGE } from "@/app/ReactQueryProvider/constants";
import { APP_END_POINT } from "@/app/ReactQueryProvider/constants";
import {
  CHANGE_USER_INFO_END_POINT,
  LOGIN_END_POINT,
  SIGN_UP_END_POINT,
} from "@/features/auth/constants";
import { DeleteTemporaryMarkingRequest } from "@/features/follow/api/deleteTemporaryMarking";
import { MY_MARKING_ENDPOINT } from "@/features/follow/constants";
import { MARKING_END_POINT } from "@/features/marking/constants";
import { PostChangeRegionRequest } from "@/features/setting/api";
import type {
  PutChangeAgeRequest,
  PutChangeGenderRequest,
  PutChangePetInfoRequest,
} from "@/features/setting/api";
import { SETTING_END_POINT } from "@/features/setting/constants";
import { MyInfo } from "@/entities/auth/api";
import { MY_INFO_END_POINT } from "@/entities/auth/constants";
import { Marking, SortType } from "@/entities/marking/api";
import { API_BASE_URL } from "@/shared/constants";
// data
import { getMockMarkingList } from "./data/markingList";
import userInfoData from "./data/myInfo.json";
import { otherUsers } from "./data/otherUser";
import { profileMarkingThumbnail as _profileMarkingThumbnail } from "./data/profileMarking";
import regionListData from "./data/regionList.json";
import { temporaryMarkingList as _temporaryMarkingList } from "./data/tempMarkingList";
import { User } from "./data/user";

interface UserInfo {
  nickname: string;
  pet: {
    name: string;
    breed: string;
    description: string | null;
    personalities: string[];
    profile: string | null;
  } | null;
  followersIds: number[];
  followingsIds: number[];
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

let temporaryMarkingList = [..._temporaryMarkingList];
const profileMarkingThumbnail = _profileMarkingThumbnail;

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
      followersIds: [],
      followingsIds: [],
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
    if (token === "freshAccessTokenGuest" && nickname === "뽀송송") {
      return HttpResponse.json(User["ROLE_GUEST"]);
    }

    if (token?.split("-")[0] === "freshAccessToken" && nickname === "뽀송송") {
      return HttpResponse.json(User["ROLE_USER"]);
    }

    const userInfo = otherUsers.find((user) => user.nickname === nickname);
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
        profile: image ? URL.createObjectURL(image) : null,
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

const getValidAuthorizationHandler = [
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
        role: "ROLE_USER",
        nickname: "뽀송송",
      },
    });
  }),
];

const putChangeRegionHandler = [
  http.post<PathParams, PostChangeRegionRequest>(
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
    const { gender } = (await request.json()) as PutChangeGenderRequest;
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
  http.put<PathParams, PutChangeAgeRequest>(
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

const putChangeNickname = [
  http.put<PathParams, { nickname: string }>(
    CHANGE_USER_INFO_END_POINT.NICKNAME,
    async ({ request }) => {
      await new Promise((res) => setTimeout(res, 1000));

      const { nickname } = await request.json();

      if (nickname === "중복" || nickname === "뽀" || nickname === "송") {
        return HttpResponse.json(
          {
            code: 409,
            message: "이미 존재하는 닉네임입니다.",
          },
          {
            status: 409,
          },
        );
      }

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

      const userKey =
        token.split("-")[1] === "naver" ? "뽀송송_NAVER" : "뽀송송_EMAIL";

      const { nickLastModDt } = userInfoDB[userKey];

      const now = new Date();
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const canChange = nickLastModDt && new Date(nickLastModDt) < oneMonthAgo;

      if (!canChange) {
        return HttpResponse.json(
          {
            code: 400,
            message: "2024-10-29 화 23:27 이후 변경이 가능합니다.",
          },
          {
            status: 400,
          },
        );
      }

      userInfoDB[userKey] = {
        ...userInfoDB[userKey],
        nickLastModDt: new Date().toISOString(),
      };

      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    },
  ),
];

const putChangePetInformationHandler = [
  http.put<PathParams, PutChangePetInfoRequest>(
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

const getFollowerListHandler = [
  http.get<PathParams>(
    `${API_BASE_URL}/users/follows/followers/:nickname`,
    async ({ request, params }) => {
      await new Promise((res) => setTimeout(res, 1000));
      const nickname = params.nickname;
      if (typeof nickname !== "string") {
        return HttpResponse.json(
          {
            code: 400,
            message: "잘못된 요청입니다.",
          },
          {
            status: 400,
          },
        );
      }

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

      const followerIds =
        nickname === "뽀송송"
          ? User["ROLE_USER"].content.followersIds
          : otherUsers.find((user) => user.nickname === nickname)?.followersIds;

      if (!followerIds) {
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

      const userInfos = otherUsers
        .filter((user) => followerIds.includes(user.userId))
        .map(({ userId, pet, nickname }) => ({ userId, pet, nickname }));

      if (followerIds.includes(1)) {
        userInfos.push({
          userId: 1,
          pet: User["ROLE_USER"].content.pet,
          nickname: User["ROLE_USER"].content.nickname,
        });
      }

      const requestUrl = new URL(request.url);
      const offset = requestUrl.searchParams.get("offset");
      const itemPerPage = 20;
      const start = Number(offset) * itemPerPage;
      const end = start + itemPerPage;
      return HttpResponse.json({
        code: 200,
        message: "success",
        content: {
          userInfos: userInfos.slice(start, end),
          totalElements: userInfos.length,
          totalPages: Math.ceil(userInfos.length / itemPerPage),
          pageAble: {
            pageNumber: Number(offset),
            pageSize: itemPerPage,
            sort: {
              empty: false,
              unsorted: false,
              sorted: true,
            },
            offset: Number(offset),
            unpaged: false,
            paged: true,
          },
        },
      });
    },
  ),
];

const getFollowingListHandler = [
  http.get<PathParams>(
    `${API_BASE_URL}/users/follows/followings/:nickname`,
    async ({ request, params }) => {
      await new Promise((res) => setTimeout(res, 1000));

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

      const nickname = params.nickname;

      if (typeof nickname !== "string") {
        return HttpResponse.json(
          {
            code: 400,
            message: "잘못된 요청입니다.",
          },
          {
            status: 400,
          },
        );
      }

      const followingIds =
        nickname === "뽀송송"
          ? User["ROLE_USER"].content.followingsIds
          : otherUsers.find((user) => user.nickname === nickname)
              ?.followingsIds;

      if (!followingIds) {
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

      const userInfos = otherUsers
        .filter((user) => followingIds.includes(user.userId))
        .map(({ userId, pet, nickname }) => ({ userId, pet, nickname }));

      if (followingIds.includes(1)) {
        userInfos.push({
          userId: 1,
          pet: User["ROLE_USER"].content.pet,
          nickname: User["ROLE_USER"].content.nickname,
        });
      }

      const requestUrl = new URL(request.url);
      const offset = requestUrl.searchParams.get("offset");
      const itemPerPage = 20;
      const start = Number(offset) * itemPerPage;
      const end = start + itemPerPage;
      return HttpResponse.json({
        code: 200,
        message: "success",
        content: {
          userInfos: userInfos.slice(start, end),
          totalElements: userInfos.length,
          totalPages: Math.ceil(userInfos.length / itemPerPage),
          pageAble: {
            pageNumber: Number(offset),
            pageSize: itemPerPage,
            sort: {
              empty: false,
              unsorted: false,
              sorted: true,
            },
            offset: Number(offset),
            unpaged: false,
            paged: true,
          },
        },
      });
    },
  ),
];

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

const getDistanceFromLatLonInKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const R = 6371; // 지구 반지름 (Km)
  const dLat = deg2rad(lat2 - lat1); // 위도 차이
  const dLon = deg2rad(lng2 - lng1); // 경도 차이

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 거리 (Km)

  return distance;
};

const markingListDB: Record<string, Marking[]> = {};

const getMarkingListHandler = [
  http.get(`${API_BASE_URL}/markings/nearby`, async ({ request }) => {
    const url = new URL(request.url);

    const lat = Number(url.searchParams.get("lat"));
    const lng = Number(url.searchParams.get("lng"));
    const southBottomLat = Number(url.searchParams.get("southBottomLat"));
    const northTopLat = Number(url.searchParams.get("northTopLat"));
    const southLeftLng = Number(url.searchParams.get("southLeftLng"));
    const northRightLng = Number(url.searchParams.get("northRightLng"));

    const markingListDBKey = `${southBottomLat}-${northTopLat}-${southLeftLng}-${northRightLng}`;

    if (!markingListDB[markingListDBKey]) {
      markingListDB[markingListDBKey] = getMockMarkingList({
        southBottomLat,
        northTopLat,
        southLeftLng,
        northRightLng,
      });
    }

    const markingList = markingListDB[markingListDBKey];

    const sortType = url.searchParams.get("sortType") as SortType;

    if (sortType === "POPULARITY") {
      markingList.sort(
        (a, b) => b.countData.likedCount - a.countData.likedCount,
      );
    } else if (sortType === "RECENT") {
      markingList.sort(
        (a, b) => new Date(b.regDt).getTime() - new Date(a.regDt).getTime(),
      );
    } else if (sortType === "DISTANCE") {
      markingList.sort(
        (a, b) =>
          getDistanceFromLatLonInKm(lat, lng, a.lat, a.lng) -
          getDistanceFromLatLonInKm(lat, lng, b.lat, b.lng),
      );
    }

    const pageNumber = Number(url.searchParams.get("offset") || 0);
    const totalCount = markingList.length;
    const pageSize = 20;
    const lastPage = Math.ceil(totalCount / pageSize);

    // sort, paged, unpaged: 의미가 없는 데이터라 임의로 설정
    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        markings: markingList.slice(
          pageNumber * pageSize,
          (pageNumber + 1) * pageSize,
        ),
        totalElements: totalCount,
        totalPages: lastPage,
        pageAble: {
          pageNumber,
          pageSize,
          sort: {
            sorted: false,
            unsorted: true,
            empty: true,
          },
          offset: pageNumber,
          paged: true,
          unpaged: false,
        },
      },
    });
  }),
];

const getBoundaryMarkerListHandler = [
  http.get(`${API_BASE_URL}/markings/marks`, async ({ request }) => {
    const url = new URL(request.url);
    const southBottomLat = Number(url.searchParams.get("southBottomLat"));
    const northTopLat = Number(url.searchParams.get("northTopLat"));
    const southLeftLng = Number(url.searchParams.get("southLeftLng"));
    const northRightLng = Number(url.searchParams.get("northRightLng"));

    const markingListDBKey = `${southBottomLat}-${northTopLat}-${southLeftLng}-${northRightLng}`;

    if (!markingListDB[markingListDBKey]) {
      markingListDB[markingListDBKey] = getMockMarkingList({
        southBottomLat,
        northTopLat,
        southLeftLng,
        northRightLng,
      });
    }

    const markingList = markingListDB[markingListDBKey];

    const markerList = markingList.map((marking) => ({
      markingId: marking.markingId,
      lat: marking.lat,
      lng: marking.lng,
      previewImage: marking.previewImage,
    }));

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: markerList,
    });
  }),
];

const postFollowingHandler = [
  http.post(
    `${API_BASE_URL}/users/follows/my-followings/:nickname`,
    async ({ request, params }) => {
      await new Promise((res) => setTimeout(res, 1000));
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
      // 보낸 유저는 모두 뽀송송 ROLE_USER로 가정하고 FOLLOWING_LIST_DATA에 추가합니다.
      const { nickname } = params;

      if (typeof nickname !== "string") {
        return HttpResponse.json(
          {
            code: 400,
            message: "잘못된 요청입니다.",
          },
          {
            status: 400,
          },
        );
      }

      const targetUser = otherUsers.find((user) => user.nickname === nickname);
      if (!targetUser) {
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

      // 내 팔로잉 ID 에 해당 유저의 userId 추가
      User["ROLE_USER"].content.followingsIds.push(targetUser.userId);
      // 해당 유저의 팔로워 ID 에 내 userId 추가
      targetUser.followersIds.push(1);

      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    },
  ),
];

const deleteFollowingHandler = [
  http.delete(
    `${API_BASE_URL}/users/follows/my-followings/:nickname`,
    async ({ request, params }) => {
      await new Promise((res) => setTimeout(res, 1000));
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
      const { nickname } = params;

      if (typeof nickname !== "string") {
        return HttpResponse.json(
          {
            code: 400,
            message: "잘못된 요청입니다.",
          },
          {
            status: 400,
          },
        );
      }

      const targetUser = otherUsers.find((user) => user.nickname === nickname);
      if (!targetUser) {
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
      // 내가 팔로잉 하는 ID 에 해당 유저의 userId 제거
      User["ROLE_USER"].content.followingsIds = User[
        "ROLE_USER"
      ].content.followingsIds.filter((id) => id !== targetUser.userId);
      // 팔로잉 취소 당하는 유저의 팔로워 ID 에 내 userId 제거
      targetUser.followersIds = targetUser.followersIds.filter(
        (id) => id !== 1,
      );

      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    },
  ),
];

const deleteFollowerHandler = [
  http.delete(
    `${API_BASE_URL}/users/follows/my-followers/:nickname`,
    async ({ request, params }) => {
      await new Promise((res) => setTimeout(res, 1000));
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
      const { nickname } = params;

      if (typeof nickname !== "string") {
        return HttpResponse.json(
          {
            code: 400,
            message: "잘못된 요청입니다.",
          },
          {
            status: 400,
          },
        );
      }

      const targetUser = otherUsers.find((user) => user.nickname === nickname);

      if (!targetUser) {
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
      // 내 팔로워 ID 에 해당 유저의 userId 제거
      User["ROLE_USER"].content.followersIds = User[
        "ROLE_USER"
      ].content.followersIds.filter((id) => id !== targetUser.userId);
      // 팔로워 취소 당하는 유저의 팔로잉 ID 에 내 userId 제거
      targetUser.followingsIds = targetUser.followingsIds.filter(
        (id) => id !== 1,
      );

      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    },
  ),
];

const getProfileThumbnailHandler = [
  http.get(
    `${API_BASE_URL}/markings/marks/:nickname`,
    async ({ request, params }) => {
      const { nickname } = params;
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

      if (profileMarkingThumbnail[nickname as string] === undefined) {
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

      const marks = profileMarkingThumbnail[nickname as string];

      const offset = Number(new URL(request.url).searchParams.get("offset"));
      const itemPerPage = 20;
      const start = offset * itemPerPage;
      const end = start + itemPerPage;

      return HttpResponse.json({
        code: 200,
        message: "success",
        content: {
          marks: marks.slice(start, end),
          totalElements: marks.length,
          totalPages: Math.ceil(marks.length / itemPerPage),
          pageAble: {
            pageNumber: offset,
            pageSize: itemPerPage,
            sort: {
              empty: true,
              unsorted: true,
              sorted: false,
            },
            offset: itemPerPage,
            unpaged: false,
            paged: true,
          },
        },
      });
    },
  ),
];

const getTemporaryMarkingListHandler = [
  http.get(`${API_BASE_URL}/markings/temporary`, async ({ request }) => {
    await new Promise((res) => setTimeout(res, 1000));
    const url = new URL(request.url);

    const offset = Number(url.searchParams.get("offset")) || 0;
    const itemPerPage = 20;
    const start = offset * itemPerPage;
    const end = start + itemPerPage;
    const data = temporaryMarkingList.slice(start, end);

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        markings: data,
        totalElements: temporaryMarkingList.length,
        totalPages: Math.ceil(temporaryMarkingList.length / itemPerPage),
        pageAble: {
          pageNumber: offset,
          pageSize: itemPerPage,
          sort: {
            empty: true,
            unsorted: true,
            sorted: false,
          },
          offset,
          unpaged: false,
          paged: true,
        },
      },
    });
  }),
];

const deleteTemporaryMarkingHandler = [
  http.delete<PathParams, DeleteTemporaryMarkingRequest>(
    MY_MARKING_ENDPOINT.DELETE_TEMPORARY_MARKING,
    async ({ request }) => {
      await new Promise((res) => setTimeout(res, 1000));
      const { id } = await request.json();

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

      temporaryMarkingList = temporaryMarkingList.filter(
        (marking) => marking.userId !== id,
      );

      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    },
  ),
];

const putModifyTempMarkingHandler = [
  http.put(MARKING_END_POINT.PUT_MODIFY_TEMP_MARKING, async ({ request }) => {
    await new Promise((res) => setTimeout(res, 1000));
    const formData = await request.formData();
    const { id, content, isVisible, removeIds, isTempSaved } = JSON.parse(
      formData.get("markingModifyDto") as string,
    );
    const images = formData.getAll("images") as File[];
    const targetTempPost = temporaryMarkingList.find(
      (marking) => marking.markingId === id,
    );

    if (!targetTempPost) {
      return HttpResponse.json(
        {
          code: 404,
          message: "해당하는 임시 마커를 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    if (isTempSaved) {
      targetTempPost.content = content;
      targetTempPost.isVisible = isVisible;
      targetTempPost.images = targetTempPost.images
        .filter(({ id }) => !removeIds.includes(id))
        .concat(
          images.map((image, idx) => ({
            id: idx,
            imageUrl: URL.createObjectURL(image),
            lank: idx,
            regDt: new Date().toISOString(),
          })),
        );
      targetTempPost.regDt = new Date().toISOString();

      temporaryMarkingList = temporaryMarkingList.map((marking) =>
        marking.markingId === id ? targetTempPost : marking,
      );

      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    }

    profileMarkingThumbnail["뽀송송"].unshift({
      markingId: id,
      previewImage: `임시저장에서 저장 된 ${id}의 썸네일`,
      lat: Math.random() > 0.5 ? 35 + Math.random() : 35 - Math.random(),
      lng: Math.random() > 0.5 ? 129 + Math.random() : 129 - Math.random(),
    });

    temporaryMarkingList = temporaryMarkingList.filter(
      ({ markingId }) => markingId !== id,
    );

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
  ...markingModalHandlers,
  ...loginHandlers,
  ...getProfileHandlers,
  ...addressHandlers,
  ...petInfoFormHandlers,
  ...postLogoutHandlers,
  ...getValidAuthorizationHandler,
  ...putChangeRegionHandler,
  ...deleteAccountHandlers,
  ...putChangeGenderHandler,
  ...putChangePasswordHandler,
  ...putSetPasswordHandler,
  ...putChangeAgeHandler,
  ...putChangeNickname,
  ...putChangePetInformationHandler,
  ...getFollowerListHandler,
  ...getFollowingListHandler,
  ...getMarkingListHandler,
  ...getBoundaryMarkerListHandler,
  ...postFollowingHandler,
  ...deleteFollowingHandler,
  ...deleteFollowerHandler,
  ...getProfileThumbnailHandler,
  ...getTemporaryMarkingListHandler,
  ...deleteTemporaryMarkingHandler,
  ...putModifyTempMarkingHandler,
];

import { http, HttpResponse, type PathParams } from "msw";
import {
  APP_END_POINT,
  ERROR_MESSAGE,
} from "@/app/ReactQueryProvider/constants";
import { LOGIN_END_POINT, SIGN_UP_END_POINT } from "@/features/auth/constants";
import { MY_INFO_END_POINT } from "@/entities/auth/constants";
import type { MyInfo } from "@/entities/auth/types/server";
import userInfoData from "../data/myInfo.json";

const postSendCodeHandler = http.post<PathParams, { email: string }>(
  SIGN_UP_END_POINT.VERIFICATION_CODE,
  async ({ request }) => {
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
  },
);

const postCheckCodeHandler = http.post<
  PathParams,
  { email: string; authNum: string }
>(SIGN_UP_END_POINT.CHECK_VERIFICATION_CODE, async ({ request }) => {
  const { authNum } = await request.json();

  if (authNum === "1111111") {
    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  }

  return HttpResponse.json(
    {
      code: 400,
      message: "이메일 인증에 실패했습니다.",
    },
    { status: 400 },
  );
});

const postSignUpByEmailHandler = http.post<
  PathParams,
  { email: string; password: string }
>(SIGN_UP_END_POINT.EMAIL, async ({ request }) => {
  const { email } = await request.json();

  if (email === "hihihi@naver.com") {
    return new HttpResponse(null, { status: 409 });
  }

  return HttpResponse.json({
    code: 200,
    message: "success",
    content: {
      authorization: "accessToken-ROLE_NONE",
      role: "ROLE_NONE",
    },
  });
});

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

const userDB: UserDB = {};

const putAddUserInfoHandler = http.put<
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
      authorization: "accessToken-ROLE_GUEST",
      role: "ROLE_GUEST",
    },
  });
});

const postCheckDuplicateNicknameHandler = http.post<
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
});

const userInfoDB: { [key: string]: MyInfo } = {
  뽀송송_EMAIL: userInfoData["EMAIL"] as MyInfo,
  뽀송송_NAVER: userInfoData["NAVER"] as MyInfo,
};

const getMyInfoHandler = http.get(MY_INFO_END_POINT, async ({ request }) => {
  const token = request.headers.get("Authorization");
  await new Promise((res) => setTimeout(res, 1500));

  if (!token?.startsWith("accessToken")) {
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

  if (token === "accessToken-ROLE_USER-naver") {
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
});

const postLoginHandler = http.post<
  PathParams,
  { email: string; password: string }
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
        authorization: "accessToken-ROLE_USER",
        role: "ROLE_USER",
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
        authorization: "accessToken-ROLE_NONE",
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
});

const postAddPetInfo = http.post<
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
        authorization: "accessToken-ROLE_USER",
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie":
          "Authorization-refresh=refreshToken-ROLE_USER; Path=/; Max-Age=3600",
      },
    },
  );
});

const getAccessTokenByRefreshTokenHandler = http.get(
  APP_END_POINT.REFRESH_ACCESS_TOKEN,
  ({ cookies }) => {
    const refreshToken = cookies["Authorization-refresh"];

    if (!refreshToken?.startsWith("refreshToken")) {
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

    const role = refreshToken.split("-")[1];

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        authorization: `accessToken-${role}`,
        role,
        nickname: "뽀송송",
      },
    });
  },
);

export const authHandlers = [
  postSendCodeHandler,
  postCheckCodeHandler,
  postSignUpByEmailHandler,
  putAddUserInfoHandler,
  postCheckDuplicateNicknameHandler,
  getMyInfoHandler,
  postLoginHandler,
  postAddPetInfo,
  getAccessTokenByRefreshTokenHandler,
];

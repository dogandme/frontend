import { http, HttpResponse, type PathParams } from "msw";
import { ERROR_MESSAGE } from "@/app/ReactQueryProvider/constants";
import type {
  PostChangeRegionRequest,
  PutChangeAgeRequest,
  PutChangeGenderRequest,
  PutChangePetInfoRequest,
} from "@/features/setting/api";
import {
  CHANGE_USER_INFO_END_POINT,
  SETTING_END_POINT,
} from "@/features/setting/constants";
import { myInfo, updateMyInfo } from "../data/myInfo";
import { MY_PROFILE } from "../data/myProfile";
import regionListData from "../data/regionList.json";

const postLogoutHandler = http.post(SETTING_END_POINT.LOGOUT, ({ request }) => {
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
});

const postChangeRegionHandler = http.post<PathParams, PostChangeRegionRequest>(
  SETTING_END_POINT.CHANGE_REGION,
  async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { newIds } = await request.json();

    const token = request.headers.get("Authorization")!;

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

    const newRegions = newIds.map(
      (id) =>
        Object.values(regionListData)
          .flat()
          .find((region) => region.id === id)!,
    );

    updateMyInfo(
      token.split("-")[1] === "naver" ? "NAVER" : "EMAIL",
      (prev) => ({ ...prev, regions: newRegions }),
    );

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

const deleteAccountHandler = http.delete<PathParams, { password: string }>(
  SETTING_END_POINT.DELETE_ACCOUNT,
  async ({ request }) => {
    await new Promise((res) => setTimeout(res, 1000));

    const token = request.headers.get("Authorization");
    const { password } = await request.json();

    if (!token?.startsWith("accessToken")) {
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
          message: "비밀번호를 다시 확인해 주세요",
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
);

const putChangeGenderHandler = http.put(
  SETTING_END_POINT.CHANGE_GENDER,
  async ({ request }) => {
    await new Promise((res) => setTimeout(res, 1000));

    const token = request.headers.get("Authorization");
    const { gender } = (await request.json()) as PutChangeGenderRequest;

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

    const userKey = token.split("-")[1] === "naver" ? "NAVER" : "EMAIL";

    updateMyInfo(userKey, (prev) => ({
      ...prev,
      gender,
    }));

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

const putChangePasswordHandler = http.put<
  PathParams,
  { password: string; newPw: string; newPwChk: string }
>(SETTING_END_POINT.CHANGE_PASSWORD, async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));
  const token = request.headers.get("Authorization");
  const { password, newPw, newPwChk } = await request.json();

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
});

const putSetPasswordHandler = http.put<
  PathParams,
  { newPw: string; newPwChk: string }
>(SETTING_END_POINT.SET_PASSWORD, async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));

  const token = request.headers.get("Authorization");
  const { newPw, newPwChk } = await request.json();

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
  updateMyInfo("NAVER", (prev) => ({ ...prev, isPasswordSet: true }));

  return HttpResponse.json({
    code: 200,
    message: "success",
  });
});

const putChangeAgeHandler = http.put<PathParams, PutChangeAgeRequest>(
  SETTING_END_POINT.CHANGE_AGE,
  async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { age } = await request.json();

    const token = request.headers.get("Authorization")!;

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

    updateMyInfo(
      token.split("-")[1] === "naver" ? "NAVER" : "EMAIL",
      (prev) => ({
        ...prev,
        age,
      }),
    );

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

const putChangeNickname = http.put<PathParams, { nickname: string }>(
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

    const userKey = token.split("-")[1] === "naver" ? "NAVER" : "EMAIL";

    const { nickLastModDt } = myInfo[userKey];

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

    updateMyInfo(userKey, (prev) => ({
      ...prev,
      nickLastModDt: new Date().toISOString(),
    }));

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

const putChangePetInformationHandler = http.put<
  PathParams,
  PutChangePetInfoRequest
>(SETTING_END_POINT.CHANGE_PET_INFO, async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));

  const token = request.headers.get("Authorization")!;

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

  const formData = await request.formData();
  const petDto = JSON.parse(formData.get("petDto") as string);
  const image = formData.get("image") as File;

  const userInfo = MY_PROFILE["ROLE_USER"];
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
  MY_PROFILE["ROLE_USER"] = newData;

  return HttpResponse.json({
    code: 200,
    message: "success",
  });
});

export const settingHandlers = [
  postLogoutHandler,
  postChangeRegionHandler,
  deleteAccountHandler,
  putChangeGenderHandler,
  putChangePasswordHandler,
  putSetPasswordHandler,
  putChangeAgeHandler,
  putChangeNickname,
  putChangePetInformationHandler,
];

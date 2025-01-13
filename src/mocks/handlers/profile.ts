import { http, HttpResponse } from "msw";
import { ERROR_MESSAGE } from "@/app/ReactQueryProvider/constants";
import { API_BASE_URL } from "@/shared/constants";
import { MY_PROFILE } from "../data/myProfile";
import { PROFILES_OF_OTHER_PEOPLE } from "../data/otherProfile";

const getProfileHandler = http.get(
  `${API_BASE_URL}/profile`,
  async ({ request }) => {
    await new Promise((res) => setTimeout(res, 1000));
    const requestUrl = new URL(request.url);
    const nickname = requestUrl.searchParams.get("nickname");

    const token = request.headers.get("Authorization");

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

    if (token === "accessToken-ROLE_NONE") {
      return HttpResponse.json(MY_PROFILE["ROLE_NONE"]);
    }

    if (
      token === "accessToken-ROLE_GUEST" &&
      nickname === MY_PROFILE["ROLE_GUEST"].content.nickname
    ) {
      return HttpResponse.json(MY_PROFILE["ROLE_GUEST"]);
    }

    if (
      token === "accessToken-ROLE_USER" &&
      nickname === MY_PROFILE["ROLE_USER"].content.nickname
    ) {
      return HttpResponse.json(MY_PROFILE["ROLE_USER"]);
    }

    const userInfo = PROFILES_OF_OTHER_PEOPLE.find(
      (user) => user.nickname === nickname,
    );

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
  },
);

export const profileHandlers = [getProfileHandler];

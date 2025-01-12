import { http, HttpResponse } from "msw";
import { ERROR_MESSAGE } from "@/app/ReactQueryProvider/constants";
import { API_BASE_URL } from "@/shared/constants";
import { OTHER_USERS, roleGuestUser } from "../data/otherUser";
import { USER } from "../data/user";

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

    if (token === "accessToken-ROLE_NONE" && nickname === "뽀송송") {
      return HttpResponse.json(USER["ROLE_NONE"]);
    }

    if (token === "accessToken-ROLE_GUEST" && nickname === "뽀송송") {
      return HttpResponse.json(USER["ROLE_GUEST"]);
    }

    if (token === "accessToken-ROLE_USER" && nickname === "뽀송송") {
      return HttpResponse.json(USER["ROLE_USER"]);
    }

    if (nickname === "나는야게스트") {
      return HttpResponse.json({
        code: 200,
        message: "success",
        content: roleGuestUser,
      });
    }

    const userInfo = OTHER_USERS.find((user) => user.nickname === nickname);

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

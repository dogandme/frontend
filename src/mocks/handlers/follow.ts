import { http, HttpResponse, type PathParams } from "msw";
import { ERROR_MESSAGE } from "@/app/ReactQueryProvider/constants";
import { API_BASE_URL } from "@/shared/constants";
import { MY_PROFILE } from "../data/myProfile";
import { PROFILES_OF_OTHER_PEOPLE } from "../data/otherProfile";

const getFollowerListHandler = http.get<PathParams>(
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

    const followerIds =
      nickname === MY_PROFILE["ROLE_USER"].content.nickname
        ? MY_PROFILE["ROLE_USER"].content.followersIds
        : PROFILES_OF_OTHER_PEOPLE.find((user) => user.nickname === nickname)
            ?.followersIds;

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

    const userInfos = PROFILES_OF_OTHER_PEOPLE.filter((user) =>
      followerIds.includes(user.userId),
    ).map(({ userId, pet, nickname }) => ({ userId, pet, nickname }));

    if (followerIds.includes(1)) {
      userInfos.push({
        userId: 1,
        pet: MY_PROFILE["ROLE_USER"].content.pet,
        nickname: MY_PROFILE["ROLE_USER"].content.nickname,
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
);

const getFollowingListHandler = http.get<PathParams>(
  `${API_BASE_URL}/users/follows/followings/:nickname`,
  async ({ request, params }) => {
    await new Promise((res) => setTimeout(res, 1000));

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
      nickname === MY_PROFILE["ROLE_USER"].content.nickname
        ? MY_PROFILE["ROLE_USER"].content.followingsIds
        : PROFILES_OF_OTHER_PEOPLE.find((user) => user.nickname === nickname)
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

    const userInfos = PROFILES_OF_OTHER_PEOPLE.filter((user) =>
      followingIds.includes(user.userId),
    ).map(({ userId, pet, nickname }) => ({ userId, pet, nickname }));

    if (followingIds.includes(1)) {
      userInfos.push({
        userId: 1,
        pet: MY_PROFILE["ROLE_USER"].content.pet,
        nickname: MY_PROFILE["ROLE_USER"].content.nickname,
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
);

const postFollowingHandler = http.post(
  `${API_BASE_URL}/users/follows/my-followings/:nickname`,
  async ({ request, params }) => {
    await new Promise((res) => setTimeout(res, 1000));
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

    const targetUser = PROFILES_OF_OTHER_PEOPLE.find(
      (user) => user.nickname === nickname,
    );
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
    MY_PROFILE["ROLE_USER"].content.followingsIds.push(targetUser.userId);
    // 해당 유저의 팔로워 ID 에 내 userId 추가
    targetUser.followersIds.push(1);

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

const deleteFollowingHandler = http.delete(
  `${API_BASE_URL}/users/follows/my-followings/:nickname`,
  async ({ request, params }) => {
    await new Promise((res) => setTimeout(res, 1000));
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

    const targetUser = PROFILES_OF_OTHER_PEOPLE.find(
      (user) => user.nickname === nickname,
    );
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
    MY_PROFILE["ROLE_USER"].content.followingsIds = MY_PROFILE[
      "ROLE_USER"
    ].content.followingsIds.filter((id) => id !== targetUser.userId);
    // 팔로잉 취소 당하는 유저의 팔로워 ID 에 내 userId 제거
    targetUser.followersIds = targetUser.followersIds.filter((id) => id !== 1);

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

const deleteFollowerHandler = http.delete(
  `${API_BASE_URL}/users/follows/my-followers/:nickname`,
  async ({ request, params }) => {
    await new Promise((res) => setTimeout(res, 1000));
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

    const targetUser = PROFILES_OF_OTHER_PEOPLE.find(
      (user) => user.nickname === nickname,
    );

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
    MY_PROFILE["ROLE_USER"].content.followersIds = MY_PROFILE[
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
);

export const followHandlers = [
  getFollowerListHandler,
  getFollowingListHandler,
  postFollowingHandler,
  deleteFollowingHandler,
  deleteFollowerHandler,
];

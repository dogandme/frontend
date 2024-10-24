import { followerListData } from "./followers";
import { followingListData } from "./followings";

export const User = {
  ROLE_GUEST: {
    code: 200,
    message: "success",
    content: {
      nickname: "뽀송송",
      socialType: "EMAIL",
      followersIds: [],
      followingsIds: [],
      likes: [],
      bookmarks: [],
      tempCnt: 3,
      markings: [],
      pet: null,
    },
  },

  ROLE_USER: {
    code: 200,
    message: "success",
    content: {
      nickname: "뽀송송",
      socialType: "EMAIL",
      followersIds: followerListData.map((data) => data.userId),
      followingsIds: followingListData.map((data) => data.userId),
      likes: [],
      bookmarks: [],
      tempCnt: 3,
      markings: [1, 2, 3, 4, 5],
      pet: {
        name: "뽀송이",
        breed: "비숑 프리제",
        description:
          "안녕하세요 저는 3살 뽀송이 입니다. 귀여운 이름과 생김새와 다르게 사람을 별로 좋아하지 않아요. 그런데 엄마는 좋아해요. 나머지 사람들은 접근 금지입니다 포항항",
        personalities: [
          "호기심 많은",
          "활동적인",
          "민첩한",
          "애착이 강한",
          "까칠한",
        ],
        profile: null,
      },
    },
  },
};

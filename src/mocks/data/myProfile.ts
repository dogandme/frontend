import { PROFILES_OF_OTHER_PEOPLE } from "./otherProfile";
import { profileMarkingThumbnail } from "./profileMarking";
import { temporaryMarkingList } from "./tempMarkingList";

export let MY_PROFILE = {
  ROLE_NONE: {
    code: 200,
    message: "success",
    content: {
      nickname: null,
      socialType: "EMAIL",
      followersIds: [],
      followingsIds: [],
      likes: [],
      bookmarks: [],
      tempCnt: 0,
      markings: [],
      pet: null,
    },
  },
  ROLE_GUEST: {
    code: 200,
    message: "success",
    content: {
      nickname: "뽀송송",
      socialType: "EMAIL",
      followersIds: [],
      followingsIds: [],
      likes: Array.from({ length: 100 }, (_, i) => 120 + i * 2),
      bookmarks: Array.from({ length: 100 }, (_, i) => 120 + i * 3),
      tempCnt: 3,
      markings: [],
      pet: null,
    },
  },
  ROLE_USER: {
    code: 200,
    message: "success",
    content: {
      userId: 1,
      nickname: "뽀송송",
      socialType: "EMAIL",
      followersIds: PROFILES_OF_OTHER_PEOPLE.filter(({ followingsIds }) =>
        followingsIds.includes(1),
      ).map(({ userId }) => userId),
      followingsIds: PROFILES_OF_OTHER_PEOPLE.filter(({ followersIds }) =>
        followersIds.includes(1),
      ).map(({ userId }) => userId),
      likes: Array.from({ length: 100 }, (_, i) => 120 + i * 2),
      bookmarks: Array.from({ length: 100 }, (_, i) => 120 + i * 3),
      tempCnt: temporaryMarkingList.length,
      markings: profileMarkingThumbnail["뽀송송"].map(
        ({ markingId }) => markingId,
      ),
      pet: {
        petId: 1,
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

export const updateMyProfile = <
  T extends Exclude<keyof typeof MY_PROFILE, "ROLE_NONE">,
>(
  role: T,
  updater: (
    target: (typeof MY_PROFILE)[T]["content"],
  ) => (typeof MY_PROFILE)[T]["content"],
) => {
  const target = MY_PROFILE[role];
  MY_PROFILE = {
    ...MY_PROFILE,
    [role]: {
      code: target.code,
      message: target.message,
      content: updater(target.content),
    },
  };
};

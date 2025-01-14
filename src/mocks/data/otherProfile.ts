// user.ts 에 존재하는 내 userId 는 1이라고 가정 합니다.
export const PROFILES_OF_OTHER_PEOPLE = Array.from({ length: 400 }).map(
  (_, i) => ({
    userId: i + 2,
    nickname: `user${i + 2}`,
    socialType: null,
    tempCnt: 0,
    followersIds: Math.random() < 0.3 ? [1] : [],
    followingsIds: i < 200 ? [1] : [],
    markings: [],
    pet: {
      petId: i + 2,
      name: `name-${i + 2}`,
      description: `description-${i + 2}`.repeat(Math.ceil(Math.random() * 10)),
      profile: Math.random() > 0.5 ? "/images/buddy" : null,
      breed: ["비숑", "비글", "시츄"][i % 3],
      personalities: [
        "애교가 많은",
        "사람을 좋아하는",
        "까칠한",
        "부끄럼이 많은",
      ].slice(0, Math.ceil(Math.random() * 4)),
    },
  }),
);

export const roleGuestUser = {
  userId: 999999,
  nickname: "나는야게스트",
  pet: null,
  socialType: null,
  tempCnt: 0,
  followersIds: [],
  followingsIds: [],
  markings: [],
};

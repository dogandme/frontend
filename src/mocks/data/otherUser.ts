// user.ts 에 존재하는 내 userId 는 1이라고 가정 합니다.
export const otherUsers = Array.from({ length: 400 }).map((_, i) => ({
  userId: i + 1,
  nickname: `user${i + 1}`,
  socialType: null,
  tempCnt: 0,
  followersIds: Math.random() < 0.3 ? [1] : [],
  followingsIds: i < 200 ? [1] : [],
  pet: {
    petId: i + 1,
    name: `name-${i + 1}`,
    description: `description-${i + 1}`.repeat(Math.ceil(Math.random() * 10)),
    profile: "/images/buddy",
    breed: ["비숑", "비글", "시츄"][i % 3],
    personalities: [
      "애교가 많은",
      "사람을 좋아하는",
      "까칠한",
      "부끄럼이 많은",
    ].slice(
      i + (Math.ceil(Math.random() * 10) % 4),
      i + (Math.ceil(Math.random() * 10) % 4),
    ),
  },
}));

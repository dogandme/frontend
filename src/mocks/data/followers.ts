export const followerListData = Array.from({ length: 200 }).map((_, index) => {
  return {
    userId: index,
    nickname: `user${index}`,
    pet: {
      petId: index,
      name: `name-${index}`,
      description: `description-${index}`.repeat(Math.ceil(Math.random() * 10)),
      profile: "/images/buddy.jpg",
      breed: ["비숑", "비글", "시츄"].at(index % 3),
      personalities: [
        "애교가 많은",
        "사람을 좋아하는",
        "까칠한",
        "부끄럼이 많은",
      ].slice(
        index + (Math.ceil(Math.random() * 10) % 4),
        index + (Math.ceil(Math.random() * 10) % 4),
      ),
    },
  };
});

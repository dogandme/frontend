function getRandomNumbersArray(length: number, max: number): number[] {
  const arr = Array.from({ length: max }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, length);
}

const randomNumbers = getRandomNumbersArray(200, 400);

export const followerListData = randomNumbers.map((num) => {
  return {
    userId: num,
    nickname: `user${num}`,
    pet: {
      petId: num,
      name: `name-${num}`,
      description: `description-${num}`.repeat(Math.ceil(Math.random() * 10)),
      profile: "/images/buddy.jpg",
      breed: ["비숑", "비글", "시츄"].at(num % 3),
      personalities: [
        "애교가 많은",
        "사람을 좋아하는",
        "까칠한",
        "부끄럼이 많은",
      ].slice(
        num + (Math.ceil(Math.random() * 10) % 4),
        num + (Math.ceil(Math.random() * 10) % 4),
      ),
    },
  };
});

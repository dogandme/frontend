import { OTHER_USERS } from "./otherUser";
import { getRandomImg } from "./randomDogImageList";

let markingCount = 0;

const makeRandomMarking = (markingId: number) => ({
  markingId,
  previewImage: getRandomImg(markingId)[0],
  lat: Math.random() > 0.5 ? 35 + Math.random() : 35 - Math.random(),
  lng: Math.random() > 0.5 ? 129 + Math.random() : 129 - Math.random(),
});

export const profileMarkingThumbnail: Record<
  string,
  { markingId: number; previewImage: string; lat: number; lng: number }[]
> = {
  뽀송송: Array.from(
    {
      length: 120,
    },
    () => makeRandomMarking(markingCount++),
  ),
  // otherUser 에 대한 랜덤한 마킹 생성
  // 마이 페이지 -> 팔로잉 , 팔로워 리스트에서 접근 가능한 유저들입니다.
  ...Object.fromEntries(
    OTHER_USERS.map(({ nickname }, idx) => {
      return [
        nickname,
        idx < 10
          ? []
          : Array.from({ length: Math.random() * 30 }, () =>
              makeRandomMarking(markingCount++),
            ),
      ];
    }),
  ),
};

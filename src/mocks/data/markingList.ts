import type { Marking } from "@/entities/marking/types/server";
import { dogImageList } from "./randomDogImageList";

export const getRandomImg = (markingId: number) => {
  return dogImageList.map((images) => images[markingId % 10]);
};

export const getRandomContent = (markingId: number) => {
  return `랜덤하게 생성된 마킹 아이디 ${markingId}의 내용입니다.`.repeat(
    Math.floor(markingId % 5),
  );
};

const randomCountArray = [
  Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000)),
  Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000)),
];

export const getMockMarkingList = ({
  southBottomLat,
  northTopLat,
  southLeftLng,
  northRightLng,
}: {
  southBottomLat: number;
  northTopLat: number;
  southLeftLng: number;
  northRightLng: number;
}) => {
  const markingList: Marking[] = Array.from({ length: 1000 }, (_, index) =>
    createMockMarking(index + 1, {
      southBottomLat,
      northTopLat,
      southLeftLng,
      northRightLng,
    }),
  );

  return markingList;
};

export const createMockMarking = (
  id: number,
  {
    southBottomLat,
    northTopLat,
    southLeftLng,
    northRightLng,
  }: {
    southBottomLat: number;
    northTopLat: number;
    southLeftLng: number;
    northRightLng: number;
  },
  nickname?: string,
): Marking => {
  return {
    markingId: id,
    region: "**시 **구 **동",
    content: getRandomContent(id),
    previewImage: getRandomImg(id)[0],
    isVisible: "PUBLIC",
    regDt: new Date().toISOString(),
    userId: id,
    nickName: nickname ?? `User${id}`,
    isOwner: id === 0 ? true : false,
    isTempSaved: false,
    lat: southBottomLat + Math.random() * (northTopLat - southBottomLat),
    lng: southLeftLng + Math.random() * (northRightLng - southLeftLng),
    address: {
      id: id,
      province: "**시",
      cityCounty: "**구",
      district: null,
      subDistrict: `district ${id}`,
    },
    countData: {
      likedCount: randomCountArray[0][id % 1000],
      savedCount: randomCountArray[1][id % 1000],
    },
    pet: {
      petId: id,
      name: `Pet${id}`,
      description: `Pet description ${id}`,
      profile: getRandomImg(id)[0],
      breed: `Breed${id}`,
      personalities: ["personality1", "personality2"],
    },
    images: Array.from({ length: Math.floor(id % 5) + 1 }, (_, idx) => ({
      imageUrl: getRandomImg(id)[idx],
      id: idx,
      lank: idx + 1,
      regDt: new Date().toISOString(),
    })),
  };
};

// 내 마킹 아이디가 120번까지기 때문에 120번 이후부터 좋아요, 저장된 마킹 리스트 생성

export const _likedMarkingList = Array.from(
  { length: 100 },
  (_, idx) => 120 + idx * 2,
).map((id) =>
  createMockMarking(id, {
    southBottomLat: 37.123456 + Math.random() * 0.1,
    northTopLat: 37.123456 + Math.random() * 0.1,
    southLeftLng: 127.123456 + Math.random() * 0.1,
    northRightLng: 127.123456 + Math.random() * 0.1,
  }),
);

export const _savedMarkingList = Array.from(
  { length: 100 },
  (_, idx) => 120 + idx * 3,
).map((id) =>
  createMockMarking(id, {
    southBottomLat: 37.123456 + Math.random() * 0.1,
    northTopLat: 37.123456 + Math.random() * 0.1,
    southLeftLng: 127.123456 + Math.random() * 0.1,
    northRightLng: 127.123456 + Math.random() * 0.1,
  }),
);

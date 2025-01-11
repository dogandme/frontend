import type { Marking } from "@/entities/marking/types/server";
import { getRandomImg } from "./getRandomImg";

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
    content:
      id % 2
        ? `${`content ${id}`.repeat(Math.random() * 10)} \n ${`content ${id}`.repeat(
            Math.random() * 10,
          )}`.repeat(Math.random() * 10)
        : `content ${id} `.repeat(Math.random() * 10),
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
      likedCount: Math.floor(Math.random() * 100),
      savedCount: Math.floor(Math.random() * 100),
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

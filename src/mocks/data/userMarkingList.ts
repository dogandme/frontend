import type { Marking } from "@/entities/marking/types/server";
import { getRandomImg } from "./getRandomImg";

export const getMockUserMarkingList = ({
  nickname,
  southBottomLat,
  northTopLat,
  southLeftLng,
  northRightLng,
}: {
  nickname: string;
  southBottomLat: number;
  northTopLat: number;
  southLeftLng: number;
  northRightLng: number;
}) => {
  const markingList: Marking[] = Array.from({ length: 140 }, (_, index) => ({
    markingId: index + 1,
    region: "**시 **구 **동",
    content: `Marking content ${index + 1}`,
    previewImage: getRandomImg(),
    isVisible: "PUBLIC",
    regDt: new Date().toISOString(),
    nickName: nickname,
    userId: index + 1,
    isOwner: true,
    isTempSaved: false,
    lat: southBottomLat + Math.random() * (northTopLat - southBottomLat),
    lng: southLeftLng + Math.random() * (northRightLng - southLeftLng),
    address: {
      id: index + 1,
      province: "**시",
      cityCounty: "**구",
      district: null,
      subDistrict: `district ${index + 1}`,
    },
    countData: {
      likedCount: Math.floor(Math.random() * 100),
      savedCount: Math.floor(Math.random() * 100),
    },
    pet: {
      petId: 1,
      name: `${nickname} Pet`,
      description: `Pet description ${index + 1}`,
      profile: getRandomImg(),
      breed: `${nickname} Breed`,
      personalities: ["personality1", "personality2"],
    },
    images: [
      {
        id: index + 1,
        imageUrl: getRandomImg(),
        lank: 1,
        regDt: new Date().toISOString(),
      },
    ],
  }));

  return markingList;
};

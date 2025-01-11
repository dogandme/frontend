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
  const markingList: Marking[] = Array.from(
    { length: 140 },
    (_, markingId) => ({
      markingId: markingId + 1,
      region: "**시 **구 **동",
      content: `Marking content ${markingId + 1}`,
      previewImage: getRandomImg(markingId)[0],
      isVisible: "PUBLIC",
      regDt: new Date().toISOString(),
      nickName: nickname,
      userId: markingId + 1,
      isOwner: true,
      isTempSaved: false,
      lat: southBottomLat + Math.random() * (northTopLat - southBottomLat),
      lng: southLeftLng + Math.random() * (northRightLng - southLeftLng),
      address: {
        id: markingId + 1,
        province: "**시",
        cityCounty: "**구",
        district: null,
        subDistrict: `district ${markingId + 1}`,
      },
      countData: {
        likedCount: Math.floor(Math.random() * 100),
        savedCount: Math.floor(Math.random() * 100),
      },
      pet: {
        petId: 1,
        name: `${nickname} Pet`,
        description: `Pet description ${markingId + 1}`,
        profile: Math.random() > 0.5 ? null : getRandomImg(markingId)[0],
        breed: `${nickname} Breed`,
        personalities: ["personality1", "personality2"],
      },
      images: Array.from(
        {
          length: Math.floor(markingId % 5) + 1,
        },
        (_, idx) => ({
          id: markingId + 1,
          imageUrl: getRandomImg(markingId)[0],
          lank: idx + 1,
          regDt: new Date().toISOString(),
        }),
      ),
    }),
  );

  return markingList;
};

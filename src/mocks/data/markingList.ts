import type { Marking } from "@/entities/marking/types/server";

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
    previewImage: "fa805c91-8228-4ec4-927f-9eb876a480c3",
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
      profile: `profile_url_${id}`,
      breed: `Breed${id}`,
      personalities: ["personality1", "personality2"],
    },
    images: [
      {
        id: id,
        imageUrl: `image_url_${id}`,
        lank: 1,
        regDt: new Date().toISOString(),
      },
    ],
  };
};

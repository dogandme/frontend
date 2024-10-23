import type { Marking } from "@/entities/marking/api";

export const getMockMarkingList = ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => {
  const markingList: Marking[] = Array.from({ length: 140 }, (_, index) => ({
    markingId: index + 1,
    region: "**시 **구 **동",
    content: `Marking content ${index + 1}`,
    previewImage: "fa805c91-8228-4ec4-927f-9eb876a480c3",
    isVisible: "PUBLIC",
    regDt: new Date().toISOString(),
    userId: index + 1,
    nickName: `User${index + 1}`,
    isOwner: true,
    isTempSaved: false,
    lat: lat + (Math.random() - 0.5) * 0.01,
    lng: lng + (Math.random() - 0.5) * 0.01,
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
      petId: index + 1,
      name: `Pet${index + 1}`,
      description: `Pet description ${index + 1}`,
      profile: `profile_url_${index + 1}`,
      breed: `Breed${index + 1}`,
      personalities: ["personality1", "personality2"],
    },
    images: [
      {
        id: index + 1,
        imageUrl: `image_url_${index + 1}`,
        lank: 1,
        regDt: new Date().toISOString(),
      },
    ],
  }));

  return markingList;
};

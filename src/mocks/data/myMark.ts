import { profileMarkingThumbnail } from "./profileMarking";

export const getMyMark = () => {
  // 뽀송송의 마커 리스트
  const myMarkerList = profileMarkingThumbnail["뽀송송"];
  // 뽀송송의 마커 리스트를 가공하여 마킹 리스트 반환
  const myMarkingList = myMarkerList.map((thumbnail, index) => ({
    ...thumbnail,
    region: "**시 **구 **동",
    content: `Marking content ${index + 1}`,
    isVisible: "PUBLIC",
    regDt: new Date().toISOString(),
    nickName: "뽀송송",
    userId: index + 1,
    isOwner: true,
    isTempSaved: false,
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
      name: `뽀송송 Pet`,
      description: `Pet description ${index + 1}`,
      profile: `profile_url_${index + 1}`,
      breed: `뽀송송 Breed`,
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

  return {
    myMarkerList,
    myMarkingList,
  };
};

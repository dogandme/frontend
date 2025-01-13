import { getRandomContent } from "./markingList";
import { profileMarkingThumbnail } from "./profileMarking";
import { getRandomImg } from "./randomDogImageList";

export const getMyMark = () => {
  // 뽀송송의 마커 리스트
  const myMarkerList = profileMarkingThumbnail["뽀송송"];
  // 뽀송송의 마커 리스트를 가공하여 마킹 리스트 반환
  const myMarkingList = myMarkerList.map((thumbnail, markingId) => ({
    ...thumbnail,
    region: "**시 **구 **동",
    content: getRandomContent(markingId),
    isVisible: "PUBLIC",
    regDt: new Date().toISOString(),
    nickName: "뽀송송",
    userId: 0,
    isOwner: true,
    isTempSaved: false,
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
      name: `뽀송송 Pet`,
      description: `Pet description ${markingId + 1}`,
      profile: null,
      breed: `뽀송송 Breed`,
      personalities: ["personality1", "personality2"],
    },
    images: Array.from({ length: Math.floor(markingId % 5) + 1 }, (_, idx) => ({
      id: markingId + 1,
      imageUrl: getRandomImg(markingId)[idx],
      lank: idx + 1,
      regDt: new Date().toISOString(),
    })),
  }));

  return {
    myMarkerList,
    myMarkingList,
  };
};

import { getRandomContent } from "./markingList";
import { profileMarkingThumbnail } from "./profileMarking";
import { getRandomImg } from "./randomDogImageList";

export let myMarkerList = profileMarkingThumbnail["뽀송송"];
export const myMarkingList = myMarkerList.map((thumbnail, markingId) => ({
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
    name: "Pet",
    description: `Pet description ${markingId + 1}`,
    profile: null,
    breed: "Breed",
    personalities: ["personality1", "personality2"],
  },
  images: Array.from({ length: Math.floor(markingId % 5) + 1 }, (_, idx) => ({
    id: idx,
    imageUrl: getRandomImg(markingId)[idx],
    lank: idx + 1,
    regDt: new Date().toISOString(),
  })),
}));

export const updateMyMark = (nickname: string) => {
  myMarkerList = profileMarkingThumbnail[nickname];
  myMarkingList.forEach((marking) => (marking.nickName = nickname));
};

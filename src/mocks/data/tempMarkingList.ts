import type { GetTemporaryMarkingListResponse } from "@/entities/marking/api";
import { IsVisible } from "@/entities/marking/types/server";
import { getRandomImg } from "./getRandomImg";

const tempMarkingId = 999;
let hours = 1;

const randomRegions = [
  {
    region: "서울특별시 도봉구 도봉로 64길 17",
    lat: 37.688 + Math.random(),
    lng: 127.046 + Math.random(),
  },
  {
    region: "서울특별시 영등포구 영등포로 353",
    lat: 37.518 + Math.random(),
    lng: 126.907 + Math.random(),
  },
  {
    region: "서울특별시 광진구 능동로 209",
    lat: 37.548 + Math.random(),
    lng: 127.086 + Math.random(),
  },
];

export const temporaryMarkingList: GetTemporaryMarkingListResponse["markings"] =
  Array.from(
    {
      length: 100,
    },
    (_, index) => {
      const markingId = index + tempMarkingId;

      const regionInfo = randomRegions[Math.ceil(Math.random() * 10) % 3];
      const randomDate = new Date();
      randomDate.setHours(randomDate.getHours() - hours++ * 5);

      // 9 의 배수인 경우에는 이미지가 없도록 합니다.
      const imageLength =
        markingId % 9 === 0 ? 0 : Math.floor(markingId % 5) + 1;

      const randomTemporaryMarking = {
        markingId,
        region: regionInfo.region,
        content:
          markingId % 2
            ? `${`content ${markingId + 1}`.repeat(Math.random() * 30)} \n\n ${`content ${markingId + 1}`.repeat(Math.random() * 30)}`
            : `content ${markingId + 1} `.repeat(Math.random() * 30),
        isVisible: (Math.random() > 0.3
          ? "PUBLIC"
          : Math.random() > 0.3
            ? "FOLLOW_ONLY"
            : "PRIVATE") as IsVisible,
        regDt: randomDate.toISOString(),
        previewImage: imageLength > 0 ? getRandomImg(markingId)[0] : null,
        userId: 1,
        nickName: "뽀송송",
        pet: {
          petId: 1,
          name: "뽀송이",
          description: "뽀송이는 귀여워요",
          profile: "profile-url",
          breed: "푸들",
          personalities: ["예민", "활발"],
        },
        isTempSaved: true,
        isOwner: true,
        lat: regionInfo.lat,
        lng: regionInfo.lng,
        address: {
          id: Math.ceil(Math.random() * 100),
          province: regionInfo.region.split(" ")[0],
          cityCounty: regionInfo.region.split(" ")[1],
          district: null,
          subDistrict: regionInfo.region.split(" ")[2],
        },
        countData: {
          likedCount: 0,
          savedCount: 0,
        },
        images: Array.from(
          {
            length: imageLength,
          },
          (_, i) => ({
            id: tempMarkingId - 1 + i,
            lank: i,
            imageUrl: getRandomImg(markingId)[i],
            regDt: randomDate.toISOString(),
          }),
        ),
      };

      return randomTemporaryMarking;
    },
  );

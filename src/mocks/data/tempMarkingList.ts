import type { GetTemporaryMarkingListResponse } from "@/entities/marking/api";

let tempMarkingId = 999;
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
    (_, i) => {
      const regionInfo = randomRegions[Math.ceil(Math.random() * 10) % 3];
      const randomDate = new Date();
      randomDate.setHours(randomDate.getHours() - hours++ * 5);

      return {
        markingId: tempMarkingId++,
        region: regionInfo.region,
        content:
          Math.random() > 0.5
            ? `임시저장 마킹${i}`.repeat(
                Math.random() > 0.3 ? Math.ceil(Math.random() * 10) : 0,
              )
            : null,
        isVisible:
          Math.random() > 0.3
            ? "PUBLIC"
            : Math.random() > 0.3
              ? "FOLLOW_ONLY"
              : "PRIVATE",
        regDt: randomDate.toISOString(),
        previewImage:
          Math.random() > 0.5 ? null : `${tempMarkingId - 1} 프리뷰 이미지`,
        userId: 1,
        nickname: "뽀송송",
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
            length: Math.min(Math.ceil(Math.random() * 10), 5),
          },
          (_, i) => ({
            id: tempMarkingId - 1 + i,
            lank: i,
            imageUrl: `${tempMarkingId - 1 + i} 이미지`,
            regDt: randomDate.toISOString(),
          }),
        ),
      };
    },
  );

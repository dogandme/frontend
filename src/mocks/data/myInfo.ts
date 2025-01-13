export const myInfo = {
  EMAIL: {
    email: "example@example.com",
    gender: "MALE",
    age: "30",
    regions: [
      {
        id: 3563,
        province: "울산광역시",
        cityCounty: "북구",
        district: "",
        subDistrict: "명촌동",
      },
    ],
    nickLastModDt: "2023-10-01T12:34:56Z",
    socialType: "EMAIL",
    isPasswordSet: true,
  },
  NAVER: {
    email: "example@naver.com",
    gender: "MALE",
    age: "30",
    regions: [
      {
        id: 3563,
        province: "울산광역시",
        cityCounty: "북구",
        district: "",
        subDistrict: "명촌동",
      },
    ],
    nickLastModDt: "2023-10-01T12:34:56Z",
    socialType: "NAVER",
    isPasswordSet: false,
  },
};

export function updateMyInfo(
  type: keyof typeof myInfo,
  updater: (
    prev: (typeof myInfo)[keyof typeof myInfo],
  ) => (typeof myInfo)[keyof typeof myInfo],
) {
  myInfo[type] = updater(myInfo[type]);
}

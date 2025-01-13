export const changeUserInfoQueryKey = {
  changeUserInfoAll: ["changeUserInfo"] as const,
  nickname: () =>
    [...changeUserInfoQueryKey.changeUserInfoAll, "putChangeNickname"] as const,
  age: () =>
    [...changeUserInfoQueryKey.changeUserInfoAll, "putChangeAge"] as const,
  gender: () =>
    [...changeUserInfoQueryKey.changeUserInfoAll, "putChangeGender"] as const,
  region: () =>
    [...changeUserInfoQueryKey.changeUserInfoAll, "postChangeRegion"] as const,
};

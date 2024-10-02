export const PROFILE_END_POINT = {
  PROFILE: (nickname: string) =>
    `${import.meta.env.VITE_API_BASE_URL}/profile?nickname=${nickname}`,
};

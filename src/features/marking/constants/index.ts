export const POST_VISIBILITY_MAP = {
  "전체 공개": "PUBLIC",
  "팔로우 공개": "FOLLOWERS_ONLY",
  "나만 보기": "PRIVATE",
} as const;

export * from "./requestUrl";
export * from "./message";

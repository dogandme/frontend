export const FOLLOW_ENDPOINT = {
  FOLLOWER_LIST: (nickname: string, offset: number) =>
    `/users/follows/followers/${nickname}?offset=${offset}`,
  FOLLOWING_LIST: (nickname: string, offset: number) =>
    `/users/follows/followings/${nickname}?offset=${offset}`,
};

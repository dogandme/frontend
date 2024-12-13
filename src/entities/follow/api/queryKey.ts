export const followQueryKey = {
  follower: (nickname: string) => ["follower", { nickname }] as const,
  following: (nickname: string) => ["following", { nickname }] as const,
} as const;

export const profileQueryKey = {
  profileAll: () => ["profile"],
  profile: (nickname: string) => [
    ...profileQueryKey.profileAll(),
    { nickname },
  ],
};

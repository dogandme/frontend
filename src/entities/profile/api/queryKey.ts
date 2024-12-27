import { useAuthStore } from "@/shared/store";

export const profileQueryKey = {
  profileAll: ["profile"] as const,
  profile: (nickname: string) => [...profileQueryKey.profileAll, { nickname }],
  myProfile: () => profileQueryKey.profile(useAuthStore.getState().nickname!),
};

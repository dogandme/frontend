import type { PetInfo } from "@/entities/profile/api/@x/follow";

export interface FollowUserInfo {
  userId: number;
  nickname: string;
  pet: PetInfo;
}

import type { PetInfo } from "@/entities/profile/api";

export interface FollowUserInfo {
  userId: number;
  nickname: string;
  pet: PetInfo;
}

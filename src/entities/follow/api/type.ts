import type { PetInfo } from "@/entities/profile/@x/follow";

export interface FollowUserInfo {
  userId: number;
  nickname: string;
  pet: PetInfo;
}

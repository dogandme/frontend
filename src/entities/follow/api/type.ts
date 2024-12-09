import type { PetInfo } from "@/entities/profile/api";

export interface UserInfo {
  userId: number;
  nickname: string;
  pet: PetInfo;
}

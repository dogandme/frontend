import type { Role } from "@/shared/store/auth";

export interface SignUpResponse<T extends Role> {
  authorization: string;
  role: T;
  nickname: string | null;
}

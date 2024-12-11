import type { Region } from "@/entities/map/@x/auth";
import { SOCIAL_TYPE } from "../constants";

export interface MyInfo {
  email: string;
  gender: "FEMALE" | "MALE" | "NONE";
  age: "10" | "20" | "30" | "40" | "50" | "60";
  regions: Region[];
  nickLastModDt: string | null;
  socialType: keyof typeof SOCIAL_TYPE;
  isPasswordSet: boolean;
}

import { create } from "zustand";
import type { Region } from "@/entities/map/types/server";

type Gender = "FEMALE" | "MALE" | "NONE" | null;
type AgeRange = 10 | 20 | 30 | 40 | 50 | 60 | null;
type CheckedList = boolean[];

interface UserInfoRegistrationFormStore {
  nickname: string;
  gender: Gender;
  ageRange: AgeRange;
  region: Region[];
  checkList: CheckedList;

  setNickname: (email: string) => void;
  setGender: (gender: Gender) => void;
  setAgeRange: (birth: AgeRange) => void;
  setRegion: (region: Region[]) => void;
  setCheckList: (checkList: CheckedList) => void;
}

export const useUserInfoRegistrationFormStore =
  create<UserInfoRegistrationFormStore>((set) => ({
    nickname: "",
    gender: null,
    ageRange: null,
    region: [],
    checkList: [false, false, false],

    setNickname: (nickname) => set({ nickname }),
    setGender: (gender) => set({ gender }),
    setAgeRange: (birth) => set({ ageRange: birth }),
    setRegion: (region) => set({ region }),
    setCheckList: (checkList) => set({ checkList }),
  }));

import { create } from "zustand";
import { compressFileImage } from "@/shared/lib";
import type { PetInfoFormData } from "../api";
import type { LatLng } from "../api/region";

export interface FileInfo {
  name: string;
  url: string;
  file: File | null;
}

interface PetInfoFormStates extends Omit<PetInfoFormData, "profile"> {
  isValidName: boolean;
  profile: FileInfo;
  isCompressing: boolean;
  inputKey: number;
}

interface PetInfoFormActions {
  setProfile: (profile: FileInfo) => void;
  setName: (name: string) => void;
  setIsValidName: (name: string) => void;
  setBreed: (breed: string) => void;
  setPersonalities: (personality: string) => void;
  setDescription: (description: string) => void;
}

const petInfoFormInitialState: PetInfoFormStates = {
  profile: { name: "", url: "/default-image.png", file: null },
  name: "",
  isValidName: true,
  breed: "",
  personalities: [],
  description: "",
  isCompressing: false,
  inputKey: 0,
};

export const usePetInfoStore = create<PetInfoFormStates & PetInfoFormActions>(
  (set, get) => ({
    ...petInfoFormInitialState,

    /**
     * profile 을 설정하던 중 압축 과정이 진행 중일 경우 isCompressing 을 true, 종료 시 false 로 변경 합니다.
     * 이 때 profile의 압축이 실패한 경우엔 실패한 profile이 아닌 기존 존재하던 profile 로 변경합니다.
     */
    setProfile: async (profile: FileInfo) => {
      const { profile: prevProfile } = get();

      if (!profile.file) {
        set({
          profile: prevProfile,
          isCompressing: false,
          inputKey: get().inputKey + 1,
        });
        return;
      }

      set({ profile, isCompressing: true, inputKey: get().inputKey + 1 });

      try {
        const compressedImage = await compressFileImage(profile.file);
        set({ profile: { ...profile, file: compressedImage } });
      } catch (error) {
        // TODO 에러 바운더리 로직 나오면 변경하기
        console.error(`
          ${profile.name}을 압축하는데 실패했습니다.
          ${error}`);

        set({
          profile: prevProfile,
          inputKey: get().inputKey + 1,
        });
      } finally {
        set({ isCompressing: false });
      }
    },
    setName: (name: string) => set({ name }),
    setIsValidName: (name: string) =>
      set(() => {
        const isValidName = new RegExp("^[가-힣a-zA-Z]{1,20}$").test(name);
        return { isValidName };
      }),
    setBreed: (breed: string) => set({ breed }),
    setPersonalities: (character: string) =>
      set((state) => {
        // 배열에 character 값이 존재 할 경우 제거하고, 존재하지 않을 경우 추가합니다.
        const isAlreadySelected = state.personalities.includes(character);

        const newCharacter = isAlreadySelected
          ? state.personalities.filter((c) => c !== character)
          : [...state.personalities, character];
        return { personalities: newCharacter };
      }),
    setDescription: (description: string) => set({ description }),
  }),
);

interface LoginFormStore {
  email: string;
  password: string;
  persistLogin: boolean;
  isValidEmail: boolean;
  statusText: string;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setPersistLogin: (persistLogin: boolean) => void;
  setIsValidEmail: (isEmailValidate: boolean) => void;
  setStatusText: (statusText: string) => void;
}

export const useLoginFormStore = create<LoginFormStore>((set) => ({
  email: "",
  password: "",
  persistLogin: false,
  isValidEmail: true,
  statusText: "이메일 형식으로 입력해 주세요",

  setEmail: (email: string) => set({ email }),
  setPassword: (password: string) => set({ password }),
  setPersistLogin: (persistLogin: boolean) => set({ persistLogin }),
  setIsValidEmail: (isValidEmail: boolean) => set({ isValidEmail }),
  setStatusText: (statusText: string) => set({ statusText }),
}));

type Gender = "FEMALE" | "MALE" | null;
type AgeRange = 10 | 20 | 30 | 40 | 50 | 60 | null;
type CheckedList = boolean[];
type Region = { address: string; id: number };

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
    setRegion: (region) =>
      set({
        region: region.sort((prev, cur) =>
          prev.address.localeCompare(cur.address),
        ),
      }),
    setCheckList: (checkList) => set({ checkList }),
  }));

interface RegionModalState {
  keyword: string;
  position: LatLng;
  origin: "keyword" | "position";
}

interface RegionModalActions {
  setKeyword: (keyword: string) => void;
  setPosition: (position: LatLng) => void;
  setOrigin: (origin: "keyword" | "position") => void;
  resetRegionModalStore: () => void;
}

const addressModalInitialState: RegionModalState = {
  keyword: "",
  position: { lat: 0, lng: 0 },
  origin: "keyword",
};

export const useRegionModalStore = create<
  RegionModalState & RegionModalActions
>((set) => ({
  ...addressModalInitialState,

  setKeyword: (keyword) => set({ keyword }),
  setPosition: (position) => set({ position }),
  setOrigin: (origin) => set({ origin }),
  resetRegionModalStore: () => set(addressModalInitialState),
}));

interface SignUpByEmailFormState {
  email: string;
  verificationCode: string;
  password: string;
  passwordConfirm: string;
}

interface SignUpByEmailFormActions {
  setEmail: (email: string) => void;
  setVerificationCode: (verificationCode: string) => void;
  setPassword: (password: string) => void;
  setPasswordConfirm: (passwordConfirm: string) => void;
  resetSignUpByEmailFormStore: () => void;
}

const initSignUpByEmailFormStore: SignUpByEmailFormState = {
  email: "",
  verificationCode: "",
  password: "",
  passwordConfirm: "",
};

export const useSignUpByEmailFormStore = create<
  SignUpByEmailFormState & SignUpByEmailFormActions
>((set) => ({
  ...initSignUpByEmailFormStore,

  setEmail: (email) => set({ email }),
  setVerificationCode: (verificationCode) => set({ verificationCode }),
  setPassword: (password) => set({ password }),
  setPasswordConfirm: (passwordConfirm) => set({ passwordConfirm }),
  resetSignUpByEmailFormStore: () => set({ ...initSignUpByEmailFormStore }),
}));

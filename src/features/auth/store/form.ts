import { create } from "zustand";

interface PetInfoStore {
  profileImage: File | null;
  name: string;
  isValidName: boolean;
  breed: string;
  characterList: string[];
  introduce: string;

  setProfileImage: (profileImage: File | null) => void;
  setName: (name: string) => void;
  setIsValidName: (name: string) => void;
  setBreed: (greed: string) => void;
  setCharacterList: (character: string) => void;
  setIntroduce: (introduce: string) => void;
}

/**
 * public 폴더에 존재하는 기본 프로필 이미지를 사용합니다.
 * origin/{파일명} 을 통해 public 폴더에 접근하는 파일에 접근 할 수 있습니다.
 */
export const usePetInfoStore = create<PetInfoStore>((set) => ({
  profileImage: null,
  name: "",
  isValidName: true,
  breed: "",
  characterList: [],
  introduce: "",

  setProfileImage: (profileImage: File | null) => set({ profileImage }),
  setName: (name: string) => set({ name }),
  setIsValidName: (name: string) =>
    set(() => {
      const isValidName = new RegExp("^[가-힣a-zA-Z]{1,20}$").test(name);
      return { isValidName };
    }),
  setBreed: (breed: string) => set({ breed }),
  setCharacterList: (character: string) =>
    set((state) => {
      // 배열에 character 값이 존재 할 경우 제거하고, 존재하지 않을 경우 추가합니다.
      const isAlreadySelected = state.characterList.includes(character);

      const newCharacter = isAlreadySelected
        ? state.characterList.filter((c) => c !== character)
        : [...state.characterList, character];
      return { characterList: newCharacter };
    }),
  setIntroduce: (introduce: string) => set({ introduce }),
}));

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
type AgeRange = 10 | 20 | 30 | 40 | 50 | null;
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

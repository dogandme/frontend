import { create } from "zustand";
import { compressFileImage } from "@/shared/lib";
import type { PetInfoFormData } from "../api";
import { validateEmail, validatePassword } from "../lib";

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

    /* profile 을 설정하던 중 압축 과정이 진행 중일 경우 isCompressing 을 true, 종료 시 false 로 변경 합니다. */
    setProfile: async (profile: FileInfo) => {
      if (!profile.file) {
        set({
          profile,
          isCompressing: false,
          inputKey: get().inputKey + 1,
        });
        return;
      }
      /**
       * 상태 변경 전 파일을 캐싱 합니다.
       * 그 이유는 압축 과정이 실패 할 경우 이전 파일로 복구하기 위함입니다.
       */
      const { profile: prevProfile } = get();
      set({ profile, isCompressing: true, inputKey: get().inputKey + 1 });

      try {
        const compressedImage = await compressFileImage(profile.file);
        set({ profile: { ...profile, file: compressedImage } });
      } catch (error) {
        // TODO 에러 바운더리 로직 나오면 변경하기
        console.error(`
          ${profile.name}을 압축하는데 실패했습니다.
          ${error}`);
        /**
         * 이미지 압축 과정에 실패하면 이전에 캐싱한 파일로 복구합니다.
         */
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

type Gender = "FEMALE" | "MALE" | "NONE" | null;
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
    setRegion: (region) => set({ region }),
    setCheckList: (checkList) => set({ checkList }),
  }));

interface SignUpByEmailFormState {
  email: string;
  isEmailEmpty: boolean;
  isValidEmail: boolean;

  verificationCode: string;

  timeLeft: number;
  isTimeLeftLessThanOneMinute: boolean;

  password: string;
  isPasswordEmpty: boolean;
  isValidPassword: boolean;

  confirmPassword: string;
  isConfirmPasswordEmpty: boolean;
  isValidConfirmPassword: boolean;

  hasEmailChangedSinceSendCodeRequest: boolean;
}

interface SignUpByEmailFormActions {
  setEmail: (email: string) => void;
  setVerificationCode: (verificationCode: string) => void;
  setTimeLeft: (timeLeft: number) => void;

  setPassword: (password: string) => void;
  setConfirmPassword: (passwordConfirm: string) => void;
  resetSignUpByEmailFormStore: () => void;

  // validation
  setHasEmailChangedSinceSendCodeRequest: (
    hasEmailChangedSinceSendCodeRequest: boolean,
  ) => void;
}

const initSignUpByEmailFormStore: SignUpByEmailFormState = {
  email: "",
  isEmailEmpty: true,
  isValidEmail: false,

  verificationCode: "",

  timeLeft: 0,
  isTimeLeftLessThanOneMinute: true,

  password: "",
  isPasswordEmpty: true,
  isValidPassword: false,

  confirmPassword: "",
  isConfirmPasswordEmpty: true,
  isValidConfirmPassword: false,

  hasEmailChangedSinceSendCodeRequest: false,
};

export const useSignUpByEmailFormStore = create<
  SignUpByEmailFormState & SignUpByEmailFormActions
>((set, get) => ({
  ...initSignUpByEmailFormStore,

  setEmail: (email) =>
    set({
      email,
      isEmailEmpty: email === "",
      isValidEmail: validateEmail(email),
    }),
  setVerificationCode: (verificationCode) => set({ verificationCode }),
  setTimeLeft: (timeLeft) =>
    set({ timeLeft, isTimeLeftLessThanOneMinute: timeLeft <= 1000 * 60 }),
  setPassword: (password) => {
    const { confirmPassword } = get();

    set({
      password,
      isPasswordEmpty: password === "",
      isValidPassword: validatePassword(password),
      isValidConfirmPassword: password === confirmPassword,
    });
  },
  setConfirmPassword: (passwordConfirm) => {
    const { password } = get();

    set({
      confirmPassword: passwordConfirm,
      isConfirmPasswordEmpty: passwordConfirm === "",
      isValidConfirmPassword: password === passwordConfirm,
    });
  },
  resetSignUpByEmailFormStore: () => set({ ...initSignUpByEmailFormStore }),

  setHasEmailChangedSinceSendCodeRequest: (
    hasEmailChangedSinceSendCodeRequest,
  ) =>
    set({
      hasEmailChangedSinceSendCodeRequest,
    }),
}));

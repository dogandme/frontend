import { create } from "zustand";
import type { LatLng } from "../api/region";
import { validateEmail, validatePassword } from "../lib";

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

const regionModalInitialState: RegionModalState = {
  keyword: "",
  position: { lat: 0, lng: 0 },
  origin: "keyword",
};

export const useRegionModalStore = create<
  RegionModalState & RegionModalActions
>((set) => ({
  ...regionModalInitialState,

  setKeyword: (keyword) => set({ keyword }),
  setPosition: (position) => set({ position }),
  setOrigin: (origin) => set({ origin }),
  resetRegionModalStore: () => set(regionModalInitialState),
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

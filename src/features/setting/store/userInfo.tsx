/**
 * modify-userinfo 페이지에서 사용하는 store입니다.
 * 해당 페이지는 전역 스토어를 가지고 있어야 하는데 해당 스토어는 UserInfo 에 저장 된 상태 값을 외부에서 주입 받아 생성 되어야 합니다.
 * 이에 zustand 공식 문서 @https://zustand.docs.pmnd.rs/guides/initialize-state-with-props 를 참고하여 생성했습니다.
 */
import { createStore } from "zustand";

// TODO userInfo API 명세서에 따라 달라지기
type Gender = "여자" | "남자";
type AgeRange = "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상";
type Region = string;
type NickName = string;

export interface ModifyUserInfoFormState {
  nickname: NickName;
  gender: Gender;
  age: AgeRange;
  regionList: Region[];
}

interface ModifyUserInfoFormAction {
  setNickname: (nickname: string) => void;
  setGender: (gender: Gender) => void;
  setAge: (age: AgeRange) => void;
  setRegion: (region: Region[]) => void;
}

interface ChangeNickNameModalState {
  _nicknameInput: NickName;
  _isNickNameValid: boolean;
  _isNickNameEmpty: boolean;
}

interface ChangeNickNameModalAction {
  _setNicknameInput: (nickname: NickName) => void;
  _setIsNickNameValid: (isValid: boolean) => void;
  _setIsNickNameEmpty: (isEmpty: boolean) => void;
}

/**
 * ModifyUserInfoFormState는 실제 서버 측으로 API 요청을 보낼 때 사용 되는 State 입니다.
 * ChangeNickNameModalState는 닉네임 변경 모달에서 사용되는 State 입니다.
 */
type State = ModifyUserInfoFormState & ChangeNickNameModalState;
type Action = ModifyUserInfoFormAction & ChangeNickNameModalAction;

export type ModifyUserInfoFormStore = ReturnType<
  typeof createModifyUserInfoStore
>;

export const createModifyUserInfoStore = (
  initialState: ModifyUserInfoFormState,
) => {
  const store = createStore<State & Action>()((set) => ({
    ...initialState,
    // ChangeNickNameModal 에서 사용 할 state
    _nicknameInput: initialState.nickname,
    _isNickNameEmpty: false,
    _isNickNameValid: true,

    setNickname: (nickname: string) => set({ nickname }),
    setGender: (gender: Gender) => set({ gender }),
    setAge: (age: AgeRange) => set({ age }),
    setRegion: (regionList: Region[]) => set({ regionList }),

    // ChangeNickNameModal 에서 사용 할 action
    _setNicknameInput: (_nicknameInput: string) => set({ _nicknameInput }),
    _setIsNickNameEmpty: (_isNickNameEmpty: boolean) =>
      set({ _isNickNameEmpty }),
    _setIsNickNameValid: (_isNickNameValid: boolean) =>
      set({ _isNickNameValid }),
  }));

  return store;
};

/**
 * modify-userinfo 페이지에서 사용하는 store입니다.
 * 해당 페이지는 전역 스토어를 가지고 있어야 하는데 해당 스토어는 UserInfo 에 저장 된 상태 값을 외부에서 주입 받아 생성 되어야 합니다.
 * 이에 zustand 공식 문서 @https://zustand.docs.pmnd.rs/guides/initialize-state-with-props 를 참고하여 생성했습니다.
 */
import { create } from "zustand";

// TODO userInfo API 명세서에 따라 달라지기
type Gender = "여자" | "남자";
type AgeRange = "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상";
type Region = { id: number; address: string };
type Nickname = string;

export interface ModifyUserInfoFormState {
  nickname: Nickname;
  gender: Gender;
  age: AgeRange;
  region: Region[];
}

interface ModifyUserInfoFormAction {
  setNickname: (nickname: string) => void;
  setGender: (gender: Gender) => void;
  setAge: (age: AgeRange) => void;
  setRegion: (region: Region[]) => void;
}

interface ChangeNicknameModalState {
  _nicknameInput: Nickname;
  _isNicknameValid: boolean;
  _isNicknameEmpty: boolean;
}

interface ChangeNicknameModalAction {
  _setNicknameInput: (nickname: Nickname) => void;
  _setIsNicknameValid: (isValid: boolean) => void;
  _setIsNicknameEmpty: (isEmpty: boolean) => void;
}

/**
 * ModifyUserInfoFormState는 실제 서버 측으로 API 요청을 보낼 때 사용 되는 State 입니다.
 * ChangeNicknameModalState는 닉네임 변경 모달에서 사용되는 State 입니다.
 */
type State = ModifyUserInfoFormState & ChangeNicknameModalState;
type Action = ModifyUserInfoFormAction & ChangeNicknameModalAction;

export type ModifyUserInfoFormStore = ReturnType<
  typeof createModifyUserInfoStore
>;

export const createModifyUserInfoStore = (
  initialState: ModifyUserInfoFormState,
) => {
  const store = create<State & Action>()((set) => ({
    ...initialState,
    // ChangeNicknameModal 에서 사용 할 state
    _nicknameInput: initialState.nickname,
    _isNicknameEmpty: false,
    _isNicknameValid: true,

    setNickname: (nickname: string) => set({ nickname }),
    setGender: (gender: Gender) => set({ gender }),
    setAge: (age: AgeRange) => set({ age }),
    setRegion: (region: Region[]) => set({ region }),

    // ChangeNicknameModal 에서 사용 할 action
    _setNicknameInput: (_nicknameInput: string) => set({ _nicknameInput }),
    _setIsNicknameEmpty: (_isNicknameEmpty: boolean) =>
      set({ _isNicknameEmpty }),
    _setIsNicknameValid: (_isNicknameValid: boolean) =>
      set({ _isNicknameValid }),
  }));

  return store;
};

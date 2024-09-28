/**
 * modify-userinfo 페이지에서 사용하는 store입니다.
 * 해당 페이지는 전역 스토어를 가지고 있어야 하는데 해당 스토어는 UserInfo 에 저장 된 상태 값을 외부에서 주입 받아 생성 되어야 합니다.
 * 이에 zustand 공식 문서 @https://zustand.docs.pmnd.rs/guides/initialize-state-with-props 를 참고하여 생성했습니다.
 */
import { createContext, useContext } from "react";
import { createStore } from "zustand";

// TODO userInfo API 명세서에 따라 달라지기
type Gender = "여자" | "남자";
type AgeRange = "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상";
type Region = string;
type NickName = string;

/**
 * _ 가 붙은 상태는 form 제출 시 사용되지 않는 상태 입니다.
 * _nicknameInput 은 ChangeNickName Modal 에서 지역적으로 사용되는 상태이지만
 * useModal 호출 당시 필요하기 때문에 전역 스토어로 관리 합니다.
 */
export interface ModifyUserInfoFormState {
  nickname: NickName;
  _nicknameInput: NickName;
  gender: Gender;
  age: AgeRange;
  regionList: Region[];
}

interface ModifyUserInfoFormAction {
  setNickname: (nickname: string) => void;
  setGender: (gender: Gender) => void;
  setAge: (age: AgeRange) => void;
  setRegion: (region: Region[]) => void;
  _setNicknameInput: (nickname: string) => void;
}

export type ModifyUserInfoFormStore = ReturnType<
  typeof createModifyUserInfoStore
>;

const createModifyUserInfoStore = (
  initialState: Omit<ModifyUserInfoFormState, "_nicknameInput">,
) => {
  const store = createStore<
    ModifyUserInfoFormState & ModifyUserInfoFormAction
  >()((set) => ({
    ...initialState,
    _nicknameInput: initialState.nickname,

    setNickname: (nickname: string) => set({ nickname }),
    _setNicknameInput: (_nicknameInput: string) => set({ _nicknameInput }),
    setGender: (gender: Gender) => set({ gender }),
    setAge: (age: AgeRange) => set({ age }),
    setRegion: (regionList: Region[]) => set({ regionList }),
  }));

  return store;
};

const ModifyUserInfoFormContext = createContext<ModifyUserInfoFormStore | null>(
  null,
);

/**
 * ModifyUserInfoProvider 는 외부에서 주입 받은 initialState 로 store 를 새롭게 생성하고
 * 하위 컴포넌트로 store 를 전달해줍니다.
 */
export const ModifyUserInfoFormStoreProvider = ({
  initialState,
  children,
}: {
  initialState: Omit<ModifyUserInfoFormState, "_nicknameInput">;
  children: React.ReactNode;
}) => {
  const store = createModifyUserInfoStore(initialState);

  return (
    <ModifyUserInfoFormContext.Provider value={store}>
      {children}
    </ModifyUserInfoFormContext.Provider>
  );
};

export const useModifyUserInfoFormStore = () =>
  useContext(ModifyUserInfoFormContext)!;

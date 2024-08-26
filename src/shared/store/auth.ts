import { create } from "zustand";
import { ROUTER_PATH } from "../constants";
type AuthStore = {
  token: string;
  role: string;
  setToken: (token: string) => void;
  setRole: (role: string) => void;
};

/**
 * 사용자의 세션을 유지하기 위한 store 입니다.
 * token은 서버로부터 받은 access token 입니다.
 * role은 사용자의 권한을 나타냅니다.
 */
export const useAuthStore = create<AuthStore>((set) => ({
  token: "",
  role: "",
  setToken: (token: string) => set({ token }),
  setRole: (role: string) => set({ role }),
}));

type LoginProcess = Pick<
  typeof ROUTER_PATH,
  | "LOGIN"
  | "LOGIN_BY_EMAIL"
  | "FORGET_PASSWORD"
  | "SIGN_UP"
  | "SIGN_UP_USER_INFO"
  | "SIGN_UP_PET_INFO"
>;

type LoginProcessPaths = LoginProcess[keyof LoginProcess];

interface LoginProcessStore {
  process: Set<LoginProcessPaths>;
  pushProcess: (process: LoginProcessPaths) => void;
  popProcess: () => void;
  clearProcess: () => void;
}

/**
 * login , signup process를 저장하기 위한 store 입니다.
 * 로그인 절차나 회원가입 절차가 완료된 경우 인증 과정을 유발시킨 페이지로 리다이렉션 시키기 위해 사용됩니다.
 * 중복값을 제거하기 위해 Set 자료구조를 사용합니다.
 */
export const useLoginProcessStore = create<LoginProcessStore>((set) => ({
  process: new Set(),
  pushProcess: (newProcess: LoginProcessPaths) => {
    set((state) => ({ process: new Set([...state.process, newProcess]) }));
  },
  popProcess: () => {
    set((state) => {
      if (state.process.size === 0) {
        return state;
      }
      return { process: new Set([...state.process].slice(0, -1)) };
    });
  },
  clearProcess: () => set({ process: new Set() }),
}));

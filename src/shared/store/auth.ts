import { create } from "zustand";

export type AuthStore = {
  token: string | null;
  role: string | null;
  userId: number | null;
  nickname: string | null;

  setToken: (token: string | null) => void;
  setRole: (role: string | null) => void;
  setUserId: (userId: number | null) => void;
  setNickname: (nickname: string | null) => void;
};

/**
 * 사용자의 세션을 유지하기 위한 store 입니다.
 * token은 서버로부터 받은 access token 입니다.
 * role은 사용자의 권한을 나타냅니다.
 */
export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  role: null,
  userId: null,
  nickname: null,

  setToken: (token: string | null) => set({ token }),
  setRole: (role: string | null) => set({ role }),
  setUserId: (userId: number | null) => set({ userId }),
  setNickname: (nickname: string | null) => set({ nickname }),
}));

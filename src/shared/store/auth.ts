import { create } from "zustand";

type AuthStore = {
  authorization: string;
  role: string;
  userId: number;

  setAuthorization: (token: string) => void;
  setRole: (role: string) => void;
  setUserId: (userId: number) => void;
};

/**
 * 사용자의 세션을 유지하기 위한 store 입니다.
 * token은 서버로부터 받은 access token 입니다.
 * role은 사용자의 권한을 나타냅니다.
 */
export const useAuthStore = create<AuthStore>((set) => ({
  authorization: "",
  role: "",
  userId: 0,

  setAuthorization: (authorization: string) => set({ authorization }),
  setRole: (role: string) => set({ role }),
  setUserId: (userId: number) => set({ userId }),
}));

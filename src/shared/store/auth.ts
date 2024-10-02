import { create } from "zustand";

export type AuthStore = {
  token: string | null;
  role: string | null;
  nickname: string | null;

  setToken: (token: string | null) => void;
  setRole: (role: string | null) => void;
  setNickname: (nickname: string | null) => void;
  reset: () => void;
};

/**
 * 사용자의 세션을 유지하기 위한 store 입니다.
 * token은 서버로부터 받은 access token 입니다.
 * role은 사용자의 권한을 나타냅니다.
 */
export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  role: null,
  nickname: null,

  setToken: (token: string | null) => set({ token }),
  setRole: (role: string | null) => set({ role }),
  setNickname: (nickname: string | null) => set({ nickname }),
  reset: () => set({ token: null, role: null, nickname: null }),
}));

// ! TODO
// ! 해당 컴포넌트는 개발 환경에서만 사용 되는 컴포넌트 입니다.
// ! import.meta.DEV 를 통해 개발 환경인지 확인합니다.
// ! 배포 시엔 해당 컴포넌트가 렌더링 되지 않지만 위험을 방지하기 위해 배포 시 해당 컴포넌트를 제거 해주세요
useAuthStore.subscribe((state) => {
  const { token, role, nickname } = state;
  if (import.meta.env.DEV) {
    console.group("DevTools - AuthStore");
    console.table({
      token,
      role,
      nickname,
    });
    console.groupEnd();
  }
});

import { create } from "zustand";

interface LastNoneAuthRouteStore {
  lastNoneAuthRoute: string;
  setLastNoneAuthRoute: (newRoute: string) => void;
}

export const useLastNoneAuthRouteStore = create<LastNoneAuthRouteStore>(
  (set) => ({
    lastNoneAuthRoute: "/",
    setLastNoneAuthRoute: (newRoute: string) =>
      set({ lastNoneAuthRoute: newRoute }),
  }),
);

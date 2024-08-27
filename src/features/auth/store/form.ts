import { create } from "zustand";

const DEFAULT_PROFILE_IMAGE = "src/shared/assets/default-profile.svg";

interface PetInfoStore {
  profileImage: string;
  name: string;
  greed: string;
  characterList: string[];
  introduce: string;

  setProfileImage: (profileImage: string) => void;
  setName: (name: string) => void;
  setGreed: (greed: string) => void;
  setCharacterList: (character: string) => void;
  setIntroduce: (introduce: string) => void;
}

export const usePetInfoStore = create<PetInfoStore>((set) => ({
  profileImage: DEFAULT_PROFILE_IMAGE,
  name: "",
  greed: "",
  characterList: [],
  introduce: "",

  setProfileImage: (profileImage: string) => set({ profileImage }),
  setName: (name: string) => set({ name }),
  setGreed: (greed: string) => set({ greed }),
  setCharacterList: (character: string) =>
    set((state) => {
      // 성격은 중복 선택이 가능하므로, 중복 선택된 성격을 제거하거나 추가합니다.
      const newCharacter = state.characterList.includes(character)
        ? state.characterList.filter((c) => c !== character)
        : [...state.characterList, character];
      return { characterList: newCharacter };
    }),
  setIntroduce: (introduce: string) => set({ introduce }),
}));

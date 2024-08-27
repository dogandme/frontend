import { create } from "zustand";

const DEFAULT_PROFILE_IMAGE = "/default-profile.svg";

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

/**
 * public 폴더에 존재하는 기본 프로필 이미지를 사용합니다.
 * origin/{파일명} 을 통해 public 폴더에 접근하는 파일에 접근 할 수 있습니다.
 */
export const usePetInfoStore = create<PetInfoStore>((set) => ({
  profileImage: `${window.location.origin}/${DEFAULT_PROFILE_IMAGE}`,
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

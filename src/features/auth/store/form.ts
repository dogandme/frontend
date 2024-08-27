import { create } from "zustand";

const DEFAULT_PROFILE_IMAGE = "default-profile.svg";

interface PetInfoStore {
  profileImage: string;
  name: string;
  isValidName: boolean;
  greed: string;
  characterList: string[];
  introduce: string;

  setProfileImage: (profileImage: string) => void;
  setName: (name: string) => void;
  setIsValidName: (name: string) => void;
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
  isValidName: true,
  greed: "",
  characterList: [],
  introduce: "",

  setProfileImage: (profileImage: string) => set({ profileImage }),
  setName: (name: string) => set({ name }),
  setIsValidName: (name: string) =>
    set({
      isValidName: new RegExp("^[가-힣a-zA-Z]{1,20}$").test(name),
    }),
  setGreed: (greed: string) => set({ greed }),
  setCharacterList: (character: string) =>
    set((state) => {
      // 배열에 character 값이 존재 할 경우 제거하고, 존재하지 않을 경우 추가합니다.
      const isAlreadyExist = state.characterList.includes(character);
      const newCharacter = isAlreadyExist
        ? state.characterList.filter((c) => c !== character)
        : [...state.characterList, character];
      return { characterList: newCharacter };
    }),
  setIntroduce: (introduce: string) => set({ introduce }),
}));

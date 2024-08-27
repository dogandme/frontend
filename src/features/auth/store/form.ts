import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

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
  setGreed: (greed: string) => void;
  setCharacterList: (character: string) => void;
  setIntroduce: (introduce: string) => void;
}

/**
 * public 폴더에 존재하는 기본 프로필 이미지를 사용합니다.
 * origin/{파일명} 을 통해 public 폴더에 접근하는 파일에 접근 할 수 있습니다.
 */

const nameRegex = /^[가-힣a-zA-Z]{1,20}$/;

export const usePetInfoStore = create<PetInfoStore>()(
  subscribeWithSelector((set) => ({
    profileImage: `${window.location.origin}/${DEFAULT_PROFILE_IMAGE}`,
    name: "",
    isValidName: true,
    greed: "",
    characterList: [],
    introduce: "",

    setProfileImage: (profileImage: string) => set({ profileImage }),
    setName: (name: string) => set({ name }),
    setGreed: (greed: string) => set({ greed }),
    setCharacterList: (character: string) =>
      set((state) => {
        const newCharacter = state.characterList.includes(character)
          ? state.characterList.filter((c) => c !== character)
          : [...state.characterList, character];
        return { characterList: newCharacter };
      }),
    setIntroduce: (introduce: string) => set({ introduce }),
  })),
);

// name 상태가 변경될 때마다 isValidName 상태를 업데이트하는 구독 설정
// ! subscribeWithSelector 미들웨어를 이용하여 state.name 상태를 셀렉하는 셀렉터와
// ! 상태 변경을 감지하는 리스너 함수를 이용하여 isValidName 상태를 변경합니다.
usePetInfoStore.subscribe(
  (state) => state.name,
  (name) => {
    console.log(name, nameRegex.test(name));
    usePetInfoStore.setState({ isValidName: nameRegex.test(name) });
  },
);

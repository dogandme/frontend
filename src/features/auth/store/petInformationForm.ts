import { createContext, useContext } from "react";
import { create, useStore } from "zustand";
import { MASCOT_IMAGE_URL } from "@/shared/constants";
import { compressFileImage } from "@/shared/lib";

export interface FileInfo {
  name: string;
  url: string;
  file: File | null;
}

export interface PetInformationFormExternalState {
  profile: FileInfo;
  name: string;
  breed: string;
  personalities: string[];
  description: string;
}

interface PetInformationFormInternalState {
  isValidName: boolean;
  isCompressing: boolean;
  inputKey: number;
}

interface PetInformationFormState
  extends PetInformationFormExternalState,
    PetInformationFormInternalState {}

interface PetInformationFormActions {
  setProfile: (profile: FileInfo) => void;
  setName: (name: string) => void;
  setBreed: (breed: string) => void;
  setPersonalities: (personality: string) => void;
  setDescription: (description: string) => void;
}

const defaultExternalState: PetInformationFormExternalState = {
  profile: { name: "", url: MASCOT_IMAGE_URL, file: null },
  name: "",
  breed: "",
  personalities: [],
  description: "",
};

export const createPetInformationFormState = (
  _initialState?: PetInformationFormExternalState,
) => {
  const initialState = _initialState
    ? { ...defaultExternalState, ..._initialState }
    : defaultExternalState;

  const defaultInternalState: PetInformationFormInternalState = {
    isValidName: new RegExp("^[가-힣a-zA-Z]{1,20}$").test(initialState.name),
    isCompressing: false,
    inputKey: 0,
  };

  return create<PetInformationFormState & PetInformationFormActions>(
    (set, get) => ({
      ...initialState,
      ...defaultInternalState,

      /* profile 을 설정하던 중 압축 과정이 진행 중일 경우 isCompressing 을 true, 종료 시 false 로 변경 합니다. */
      setProfile: async (profile: FileInfo) => {
        if (!profile.file) {
          set({
            profile,
            isCompressing: false,
            inputKey: get().inputKey + 1,
          });
          return;
        }
        /**
         * 상태 변경 전 파일을 캐싱 합니다.
         * 그 이유는 압축 과정이 실패 할 경우 이전 파일로 복구하기 위함입니다.
         */
        const { profile: prevProfile } = get();
        set({ profile, isCompressing: true, inputKey: get().inputKey + 1 });

        try {
          const compressedImage = await compressFileImage(profile.file);
          set({ profile: { ...profile, file: compressedImage } });
        } catch (error) {
          // TODO 에러 바운더리 로직 나오면 변경하기
          console.error(`
          ${profile.name}을 압축하는데 실패했습니다.
          ${error}`);
          /**
           * 이미지 압축 과정에 실패하면 이전에 캐싱한 파일로 복구합니다.
           */
          set({
            profile: prevProfile,
            inputKey: get().inputKey + 1,
          });
        } finally {
          set({ isCompressing: false });
        }
      },
      setName: (name: string) =>
        set({
          name,
          isValidName: new RegExp("^[가-힣a-zA-Z]{1,20}$").test(name),
        }),

      setBreed: (breed: string) => set({ breed }),
      setPersonalities: (personality: string) =>
        set(({ personalities }) => {
          // 배열에 personality 값이 존재 할 경우 제거하고, 존재하지 않을 경우 추가합니다.
          const isAlreadySelected = personalities.includes(personality);

          const newPersonality = isAlreadySelected
            ? personalities.filter((c) => c !== personality)
            : [...personalities, personality];
          return { personalities: newPersonality };
        }),

      setDescription: (description: string) => set({ description }),
    }),
  );
};

export type PetInformationFormStore = ReturnType<
  typeof createPetInformationFormState
>;
export const PetInformationFormStoreContext =
  createContext<PetInformationFormStore | null>(null);

export const usePetInformationFormContext = () => {
  const store = useContext(PetInformationFormStoreContext);
  if (!store) {
    throw new Error(
      "usePetInformationFormContext 는 PetInformationFormContext 내부에서만 사용 가능 합니다.",
    );
  }
  return store;
};

export const usePetInformationFormStore = <T>(
  selector: (state: PetInformationFormState & PetInformationFormActions) => T,
): T => {
  const store = usePetInformationFormContext();
  if (!store) {
    throw new Error(
      "usePetInformationFormStore 는 PetInformationFormContext 내부에서만 사용 가능 합니다.",
    );
  }
  return useStore(store, selector);
};

import { create } from "zustand";
import type { FileInfo } from "@/features/auth/store";
import { POST_VISIBILITY_MAP } from "../constants";

interface MarkingFileInfo extends FileInfo {
  file: Promise<File>;
}

interface MarkingFormState {
  region: string;
  visibility: keyof typeof POST_VISIBILITY_MAP | "";
  content: string;
  images: MarkingFileInfo[];
  isCompressing: boolean;
  inputKey: number;
}

interface MarkingFormActions {
  setRegion: (region: string) => void;
  setVisibility: (visibility: keyof typeof POST_VISIBILITY_MAP) => void;
  setContent: (content: string) => void;
  setImages: (images: MarkingFileInfo[]) => void;
  resetMarkingFormStore: () => void;
}

const MarkingFormInitialState: MarkingFormState = {
  region: "",
  visibility: "",
  content: "",
  images: [],
  isCompressing: false,
  inputKey: 0,
};

export const useMarkingFormStore = create<
  MarkingFormState & MarkingFormActions
>((set, get) => ({
  ...MarkingFormInitialState,

  setRegion: (region) => set({ region }),
  setVisibility: (visibility) => set({ visibility }),
  setContent: (content) => set({ content }),
  setImages: (images) => {
    /* 동기적으로 압축 예정인 이미지 파일을 업데이트 합니다. */
    set({ images, isCompressing: true, inputKey: get().inputKey + 1 });

    /** 압축이 모두 종료 된 경우 비동기적으로 상태를 다시 업데이트 합니다.
     * 이 때 모든 file 들이 settled 된 이후 압축이 완료된 이미지만 남깁니다.
     * 압축이 실패한 이미지는 콘솔에 에러를 출력하고 제외합니다.
     *
     * 이 때 actual DOM에 마운트 된 input을 업데이트 하기 위해 inputKey를 증가시킵니다.
     * actual DOM의 input을 새로 마운트 시킴으로서 액츄얼 돔의 input이 업데이트 된 이미지를 정상적으로 바라 볼 수 있도록 합니다.
     */
    Promise.allSettled(images.map(({ file }) => file))
      .then((settledResult) => {
        const optimisticImages = get().images;
        const compressedImages = optimisticImages.filter((_, index) => {
          const compressionResult = settledResult[index];
          if (compressionResult.status === "rejected") {
            // TODO 에러 바운더리 로직 나오면 변경하기
            console.error(compressionResult.reason);
            return false;
          }
          return true;
        });

        if (compressedImages.length < images.length) {
          set({ images: compressedImages, inputKey: get().inputKey + 1 });
        }
      })
      .finally(() => {
        set({ isCompressing: false });
      });
  },
  resetMarkingFormStore: () => set(MarkingFormInitialState),
}));

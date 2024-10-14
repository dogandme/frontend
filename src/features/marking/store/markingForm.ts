import { create } from "zustand";
import type { FileInfo } from "@/features/auth/store";
import { compressFileImage } from "@/shared/lib";
import { POST_VISIBILITY_MAP } from "../constants";

interface MarkingFileInfo extends FileInfo {
  file: NonNullable<FileInfo["file"]>;
}

interface MarkingFormState {
  region: string;
  isVisible: keyof typeof POST_VISIBILITY_MAP | "";
  content: string;
  images: MarkingFileInfo[];
  isCompressing: boolean;
  inputKey: number;
}

interface MarkingFormActions {
  setRegion: (region: string) => void;
  setVisibility: (isVisible: keyof typeof POST_VISIBILITY_MAP) => void;
  setContent: (content: string) => void;
  setImages: (images: MarkingFileInfo[]) => void;
  resetMarkingFormStore: () => void;
}

const MarkingFormInitialState: MarkingFormState = {
  region: "",
  isVisible: "",
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
  setVisibility: (isVisible) => set({ isVisible }),
  setContent: (content) => set({ content }),
  /** 압축이 모두 종료 된 경우 비동기적으로 상태를 다시 업데이트 합니다.
   * 이 때 모든 file 들이 settled 된 이후 압축이 완료된 이미지만 남깁니다.
   * 압축이 실패한 이미지는 콘솔에 에러를 출력하고 제외합니다.
   *
   * 이 때 actual DOM에 마운트 된 input을 업데이트 하기 위해 inputKey를 증가시킵니다.
   * actual DOM의 input을 새로 마운트 시킴으로서 액츄얼 돔의 input이 업데이트 된 이미지를 정상적으로 바라 볼 수 있도록 합니다.
   */
  setImages: async (images) => {
    /**
     * 사진이 추가되지 않고  사진이 삭제 된 경우엔 압축을 시작하지 않고 종료합니다.
     */
    if (images.length < get().images.length) {
      set({ images, isCompressing: false, inputKey: get().inputKey + 1 });
      return;
    }
    /* 동기적으로 압축 예정인 이미지 파일을 업데이트 합니다. */
    set({ images, isCompressing: true, inputKey: get().inputKey + 1 });

    const compressedFiles = await Promise.allSettled(
      images.map(({ file }) => compressFileImage(file)),
    );

    const resolvedImages = images.filter(({ name }, index) => {
      const { status } = compressedFiles[index];
      if (status === "rejected") {
        console.error(
          `${name} 을 압축하는데 실패했습니다.
          ${(compressedFiles[index] as PromiseRejectedResult).reason}`,
        );
        return false;
      }
      return true;
    });

    /**
     * 압축에 실패한 경우엔 input key를 증가 시켜 다시 마운트 합니다.
     * input 이 업데이트 되었을 때의 순간과 압축이 완료된 순간이 다를 수 있기 때문입니다.
     */
    if (resolvedImages.length < images.length) {
      set({
        images: resolvedImages,
        isCompressing: false,
        inputKey: get().inputKey + 1,
      });
      return;
    }
    set({
      images: resolvedImages,
      isCompressing: false,
    });
  },
  resetMarkingFormStore: () => set(MarkingFormInitialState),
}));

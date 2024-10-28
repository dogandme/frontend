import { createContext, useContext, useRef } from "react";
import { create, useStore } from "zustand";
import { TempMarkingFileInfo, TempMarkingInfo } from "@/entities/marking/api";
import { compressFileImage } from "@/shared/lib";
import { MarkingFileInfo } from "./markingForm";

// TODO 타입 스크립트 리팩토링 시 변경 하기

export interface TempMarkingFormExternalState
  extends Pick<TempMarkingInfo, "region" | "isVisible" | "content"> {
  externalImages: TempMarkingFileInfo[];
}

interface TempMarkingFormInternalState {
  isCompressing: boolean;
  inputKey: number;
  images: MarkingFileInfo[];
  removedIds: TempMarkingFileInfo["id"][];
}

type TempMarkingFormState = TempMarkingFormExternalState &
  TempMarkingFormInternalState;

interface TempMarkingFormAction {
  setIsVisible: (isVisible: TempMarkingInfo["isVisible"]) => void;
  setContent: (content: string | null) => void;
  setExternalImages: (images: TempMarkingFileInfo[]) => void;
  setRemovedIds: (removedIds: TempMarkingFileInfo["id"][]) => void;

  setImages: (images: MarkingFileInfo[]) => void;
  setIsCompressing: (isCompressing: boolean) => void;
  setInputKey: (inputKey: number) => void;
}

export const createTempMarkingFormState = (
  initialState: TempMarkingFormExternalState,
) => {
  return create<TempMarkingFormState & TempMarkingFormAction>((set, get) => ({
    ...initialState,
    isCompressing: false,
    inputKey: 0,
    images: [],
    removedIds: [],

    setIsVisible: (isVisible) => set({ isVisible }),
    setContent: (content) => set({ content }),
    setExternalImages: (externalImages) => set({ externalImages }),
    setRemovedIds: (removedIds) => set({ removedIds }),

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

      /* 이미지 압축 실패 했던 내역에 대한 로그 남기기 */
      compressedFiles
        .filter((result) => result.status === "rejected")
        .forEach((result, index) => {
          console.error(
            `${images[index].name}을 압축하는데 실패했습니다.`,
            result.reason,
          );
        });

      const resolvedImages = compressedFiles
        .map((result, index) => ({
          ...images[index],
          file:
            result.status === "fulfilled" ? result.value : images[index].file,
        }))
        .filter((_, index) => compressedFiles[index].status === "fulfilled");

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
    setIsCompressing: (isCompressing) => set({ isCompressing }),
    setInputKey: (inputKey) => set({ inputKey }),
  }));
};

type TempMarkingFormStore = ReturnType<typeof createTempMarkingFormState>;

export const TempMarkingFormContext =
  createContext<TempMarkingFormStore | null>(null);

export const TempMarkingFormProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: TempMarkingFormExternalState;
}) => {
  const store = useRef(createTempMarkingFormState(initialState)).current;

  return (
    <TempMarkingFormContext.Provider value={store}>
      {children}
    </TempMarkingFormContext.Provider>
  );
};

export const useTempMarkingFormContext = () => {
  const store = useContext(TempMarkingFormContext);
  if (!store) {
    throw new Error(
      "useTempMarkingFormContext는 TempMarkingFormProvider 내에서 사용되어야 합니다.",
    );
  }
  return store;
};

export const useTempMarkingForm = <T,>(
  selector: (state: TempMarkingFormState & TempMarkingFormAction) => T,
): T => {
  const store = useTempMarkingFormContext();
  return useStore(store, selector);
};

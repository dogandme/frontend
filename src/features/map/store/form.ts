import { create } from "zustand";

interface MarkingFormState {
  region: string;
  visibility: string;
  content: string;
  images: File[];
}

interface MarkingFormActions {
  setRegion: (region: string) => void;
  setVisibility: (visibility: string) => void;
  setContent: (content: string) => void;
  setImages: (images: File[]) => void;
  reset: () => void;
}

const MarkingFormInitialState: MarkingFormState = {
  region: "",
  visibility: "",
  content: "",
  images: [],
};

export const useMarkingFormStore = create<
  MarkingFormState & MarkingFormActions
>((set) => ({
  ...MarkingFormInitialState,

  setRegion: (region) => set({ region }),
  setVisibility: (visibility) => set({ visibility }),
  setContent: (content) => set({ content }),
  setImages: (images) => set({ images }),
  reset: () => set(MarkingFormInitialState),
}));

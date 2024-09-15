import { create } from "zustand";
import { PostVisibilityKey } from "../constants";

interface MarkingFormState {
  region: string;
  visibility: PostVisibilityKey | "";
  content: string;
  images: File[];
}

interface MarkingFormActions {
  setRegion: (region: string) => void;
  setVisibility: (visibility: PostVisibilityKey) => void;
  setContent: (content: string) => void;
  setImages: (images: File[]) => void;
  resetMarkingFormStore: () => void;
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
  resetMarkingFormStore: () => set(MarkingFormInitialState),
}));

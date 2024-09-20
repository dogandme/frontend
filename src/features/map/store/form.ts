import { create } from "zustand";
import { POST_VISIBILITY_MAP } from "../constants";

interface MarkingFormState {
  region: string;
  visibility: keyof typeof POST_VISIBILITY_MAP | "";
  content: string;
  images: File[];
}

interface MarkingFormActions {
  setRegion: (region: string) => void;
  setVisibility: (visibility: keyof typeof POST_VISIBILITY_MAP) => void;
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

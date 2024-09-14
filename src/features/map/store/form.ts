import { create } from "zustand";
import { POST_VISIBILITY_KEY } from "../constants";

interface MarkingFormState {
  region: string;
  visibility: POST_VISIBILITY_KEY | "";
  content: string;
  images: File[];
}

interface MarkingFormActions {
  setRegion: (region: string) => void;
  setVisibility: (visibility: POST_VISIBILITY_KEY) => void;
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

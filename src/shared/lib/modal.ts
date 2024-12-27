import { useOverlay, type UseOverlay } from "./overlay";

type UseModal = (
  createOverlayComponent: Parameters<UseOverlay>[0],
  options?: Omit<Parameters<UseOverlay>[1], "disableInteraction">,
) => ReturnType<UseOverlay>;

export const useModal: UseModal = (createOverlayComponent, options) => {
  return useOverlay(createOverlayComponent, {
    disableInteraction: true,
    ...options,
  });
};

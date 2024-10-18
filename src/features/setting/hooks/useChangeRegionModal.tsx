import { useQueryClient } from "@tanstack/react-query";
import { RegionModal } from "@/features/auth/ui";
import { MyInfo } from "@/entities/auth/api";
import { useModal } from "@/shared/lib";
import { usePutChangeRegion } from "../api/putChangeRegion";

export const useChangeRegionModal = (regions: MyInfo["regions"]) => {
  const queryClient = useQueryClient();
  const { mutate: putChangeRegion } = usePutChangeRegion();
  const { handleOpen, onClose } = useModal(
    () => (
      <RegionModal
        onClose={onClose}
        onSave={(regionListInRegionModal) => {
          /* 기존 저장 된 regionListInRegionModal에서 추가 되거나 삭제 될 region id 들을 필터링 합니다.  */
          const prevRegionIds = regions.map(({ id }) => id);
          const nextRegionIds = regionListInRegionModal.map(({ id }) => id);

          const removeIds = prevRegionIds.filter(
            (id) => !nextRegionIds.includes(id),
          );
          const addIds = nextRegionIds.filter(
            (id) => !prevRegionIds.includes(id),
          );

          if (removeIds.length === 0 && addIds.length === 0) {
            onClose();
            return;
          }
          putChangeRegion(
            {
              removeIds,
              addIds,
            },
            {
              onSuccess: onClose,
            },
          );
        }}
        initialState={{
          regionList: regions,
        }}
      />
    ),
    {
      beforeClose: () => {
        // TODO : 추후 하나의 메소드로 리팩토링 하기
        return (
          queryClient
            .getMutationCache()
            .findAll({
              mutationKey: ["putChangeRegion"],
            })
            .reverse()[0]?.state.status === "pending"
        );
      },
    },
  );

  return handleOpen;
};

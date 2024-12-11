import { useQueryClient } from "@tanstack/react-query";
import { RegionModal } from "@/features/auth/ui";
import type { Region } from "@/entities/map/types/server";
import { useModal } from "@/shared/lib";
import { usePostChangeRegion } from "../api";

type useChangePetInfoModalParams = Region[];

export const useChangeRegionModal = (regions: useChangePetInfoModalParams) => {
  const queryClient = useQueryClient();
  const { mutate: putChangeRegion } = usePostChangeRegion();
  const { handleOpen, onClose } = useModal(
    () => (
      <RegionModal
        onClose={onClose}
        onSave={(regionList) => {
          putChangeRegion({
            newIds: regionList.map((region) => region.id),
          });
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

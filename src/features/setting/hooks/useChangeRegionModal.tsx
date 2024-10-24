import { useQueryClient } from "@tanstack/react-query";
import { RegionModal } from "@/features/auth/ui";
import { MyInfo } from "@/entities/auth/api";
import { useModal } from "@/shared/lib";
import { usePostChangeRegion } from "../api";

export const useChangeRegionModal = (regions: MyInfo["regions"]) => {
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

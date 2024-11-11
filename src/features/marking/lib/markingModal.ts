import { useQueryClient } from "@tanstack/react-query";
import { useModal, type CreateOveralyComponent } from "@/shared/lib";

/**
 * 해당 훅은 마킹과 관련된 뮤테이션을 처리하는 마킹 폼 모달 (마킹 모달, 마킹 편집 모달) 을 사용 할 때 사용 합니다.
 * 마킹 폼 모달을 사용하는 뮤테이션 키가 동작중일 때에는 모달을 닫지 않습니다.
 */
export const useMarkingFormModal = (
  createOveralyComponent: CreateOveralyComponent,
) => {
  const queryClient = useQueryClient();

  return useModal(createOveralyComponent, {
    beforeClose: () => {
      return (
        queryClient
          .getMutationCache()
          .findAll({
            mutationKey: ["markingFormModal"],
          })
          .reverse()[0]?.state.status === "pending"
      );
    },
  });
};

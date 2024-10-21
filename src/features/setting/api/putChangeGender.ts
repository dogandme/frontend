import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MyInfo } from "@/entities/auth/api";
import { apiClient } from "@/shared/lib";
import { SETTING_END_POINT } from "../constants";

export type PutChangeGenderRequestData = Pick<MyInfo, "gender">;

const putChangeGender = async (
  changeGenderData: PutChangeGenderRequestData,
) => {
  return apiClient.put(SETTING_END_POINT.CHANGE_GENDER, {
    withToken: true,
    body: changeGenderData,
  });
};

export const usePutChangeGender = () => {
  const queryClient = useQueryClient();

  /**
   * 해당 이펙트는 낙관적 업데이트 이후 뮤테이션이 pending 상태일 때 언마운트 되게 된다면 데이터의 무결성을 위해 invalidateQueries를 호출해야 합니다.
   * 이 작업은 myInfo 쿼리의 staleTime이 늘어날 것임을 기대하고 한 작업입니다.
   */
  useEffect(() => {
    return () => {
      const cachedMutation = [
        ...queryClient.getMutationCache().findAll({
          mutationKey: ["putChangeGender"],
        }),
      ].reverse()[0];

      if (cachedMutation?.state.status === "pending") {
        queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      }
    };
  }, [queryClient]);

  return useMutation({
    mutationKey: ["putChangeGender"],
    mutationFn: putChangeGender,

    /* 낙관적 업데이트 시행 */
    onMutate: async ({ gender }) => {
      await queryClient.cancelQueries({ queryKey: ["myInfo"] });
      const prevQueryData = queryClient.getQueryData<MyInfo>(["myInfo"]);

      queryClient.setQueryData(["myInfo"], (prevQueryData?: MyInfo) => {
        if (!prevQueryData) return prevQueryData;
        return {
          ...prevQueryData,
          content: {
            ...prevQueryData,
            gender: gender,
          },
        };
      });

      return prevQueryData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
    onError: (error, variable, context) => {
      queryClient.setQueryData(["myInfo"], context);
    },
  });
};

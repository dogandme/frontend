import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MyInfo } from "@/entities/auth/api";
import { authQueryKey } from "@/entities/auth/constants";
import { apiClient } from "@/shared/lib";
import { SETTING_END_POINT } from "../constants";

export interface PutChangeAgeRequest extends Pick<MyInfo, "age"> {}

const putChangeAge = async (changeAgeData: PutChangeAgeRequest) => {
  return apiClient.put(SETTING_END_POINT.CHANGE_AGE, {
    withToken: true,
    body: changeAgeData,
  });
};

export const usePutChangeAge = () => {
  const queryClient = useQueryClient();

  /**
   * 해당 이펙트는 낙관적 업데이트 이후 뮤테이션이 pending 상태일 때 언마운트 되게 된다면 데이터의 무결성을 위해 invalidateQueries를 호출해야 합니다.
   * 이 작업은 myInfo 쿼리의 staleTime이 늘어날 것임을 기대하고 한 작업입니다.
   */
  useEffect(() => {
    return () => {
      const cachedMutation = [
        ...queryClient.getMutationCache().findAll({
          mutationKey: ["putChangeAge"],
        }),
      ].reverse()[0];

      if (cachedMutation?.state.status === "pending") {
        queryClient.invalidateQueries({ queryKey: authQueryKey.myInfo() });
      }
    };
  }, [queryClient]);

  return useMutation<unknown, Error, PutChangeAgeRequest>({
    mutationKey: ["putChangeAge"],
    mutationFn: putChangeAge,

    /* 낙관적 업데이트 시행 */
    onMutate: async ({ age }) => {
      await queryClient.cancelQueries({ queryKey: authQueryKey.myInfo() });
      const prevQueryData = queryClient.getQueryData<MyInfo>(
        authQueryKey.myInfo(),
      );

      queryClient.setQueryData(
        authQueryKey.myInfo(),
        (prevQueryData?: MyInfo) => {
          if (!prevQueryData) return prevQueryData;

          return {
            ...prevQueryData,
            age,
          };
        },
      );

      return prevQueryData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKey.myInfo() });
    },
    onError: (_error, _variable, context) => {
      queryClient.setQueryData(authQueryKey.myInfo(), context);
    },
  });
};

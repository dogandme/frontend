import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authQueryKey } from "@/entities/auth/api";
import type { MyInfo } from "@/entities/auth/types/server";
import { apiClient } from "@/shared/lib";
import { SETTING_END_POINT } from "../constants";
import { changeUserInfoQueryKey } from "./queryKey";

export type PutChangeAgeRequest = Pick<MyInfo, "age">;

const putChangeAge = async (changeAgeData: PutChangeAgeRequest) => {
  return apiClient.put(SETTING_END_POINT.CHANGE_AGE, {
    withToken: true,
    body: changeAgeData,
  });
};

export const usePutChangeAge = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, PutChangeAgeRequest>({
    mutationKey: changeUserInfoQueryKey.age(),
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

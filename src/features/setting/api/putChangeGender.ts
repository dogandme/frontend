import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authQueryKey } from "@/entities/auth/api";
import type { MyInfo } from "@/entities/auth/types/server";
import { apiClient } from "@/shared/lib";
import { SETTING_END_POINT } from "../constants";
import { changeUserInfoQueryKey } from "./queryKey";

export type PutChangeGenderRequest = Pick<MyInfo, "gender">;

const putChangeGender = async (changeGenderData: PutChangeGenderRequest) => {
  return apiClient.put(SETTING_END_POINT.CHANGE_GENDER, {
    withToken: true,
    body: changeGenderData,
  });
};

export const usePutChangeGender = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, PutChangeGenderRequest>({
    mutationKey: changeUserInfoQueryKey.gender(),
    mutationFn: putChangeGender,

    /* 낙관적 업데이트 시행 */
    onMutate: async ({ gender }) => {
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
            gender,
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

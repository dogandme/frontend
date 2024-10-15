import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MyInfo, UserInfoResponse } from "@/entities/auth/api";
import { AuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

export type PutChangeAgeRequestData = Pick<MyInfo, "age"> & {
  token: NonNullable<AuthStore["token"]>;
};

interface PutChangeAgeResponse {
  code: number;
  message: string;
}

const putChangeAge = async ({ token, age }: PutChangeAgeRequestData) => {
  const response = await fetch(SETTING_END_POINT.CHANGE_AGE, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ age }),
  });

  const data: PutChangeAgeResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const usePutChangeAge = () => {
  const queryClient = useQueryClient();
  const mutationKey = ["putChangeAge"];

  /**
   * 해당 메소드는 낙관적 업데이트 이후 뮤테이션이 pending 상태일 때 언마운트 되게 된다면 데이터의 무결성을 위해 invalidateQueries를 호출해야 합니다.
   * 이 작업은 myInfo 쿼리의 staleTime이 늘어날 것임을 기대하고 한 작업입니다.
   */
  const optimisticCleanUpMethod = () => {
    const cachedMutation = [
      ...queryClient.getMutationCache().getAll(),
    ].reverse()[0];

    if (cachedMutation?.state.status === "pending") {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    }
  };

  const mutation = useMutation({
    mutationKey,
    mutationFn: putChangeAge,

    /* 낙관적 업데이트 시행 */
    onMutate: async ({ age }) => {
      await queryClient.cancelQueries({ queryKey: ["myInfo"] });
      const prevQueryData = queryClient.getQueryData<UserInfoResponse>([
        "myInfo",
      ]);

      queryClient.setQueryData(
        ["myInfo"],
        (prevQueryData: UserInfoResponse | undefined) => {
          if (!prevQueryData) return prevQueryData;
          return {
            ...prevQueryData,
            content: {
              ...prevQueryData.content,
              age: age,
            },
          };
        },
      );

      return prevQueryData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
    onError: (error, variable, context) => {
      queryClient.setQueryData(["myInfo"], context);
    },
  });

  return { ...mutation, optimisticCleanUpMethod };
};

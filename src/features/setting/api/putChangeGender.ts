import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MyInfo, UserInfoResponse } from "@/entities/auth/api";
import { AuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

export type PutChangeAgeRequestData = Pick<MyInfo, "gender"> & {
  token: NonNullable<AuthStore["token"]>;
};

interface PutChangeGenderResponse {
  code: number;
  message: string;
}

const putChangeGender = async ({ token, gender }: PutChangeAgeRequestData) => {
  const response = await fetch(SETTING_END_POINT.CHANGE_GENDER, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ gender }),
  });

  const data: PutChangeGenderResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const usePutChangeGender = () => {
  const queryClient = useQueryClient();
  const mutationKey = ["putChangeGender"];

  /**
   * 해당 메소드는 낙관적 업데이트 이후 뮤테이션이 pending 상태일 때 언마운트 되게 된다면 데이터의 무결성을 위해 invalidateQueries를 호출해야 합니다.
   * 이 작업은 myInfo 쿼리의 staleTime이 늘어날 것임을 기대하고 한 작업입니다.
   */
  const optimisticCleanUpMethod = () => {
    const cachedMutation = [...queryClient.getMutationCache().getAll()]
      .reverse()
      .find((mutation) => mutation?.options.mutationKey === mutationKey);

    if (cachedMutation?.state.status === "pending") {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    }
  };

  const mutation = useMutation({
    mutationKey,
    mutationFn: putChangeGender,

    /* 낙관적 업데이트 시행 */
    onMutate: async ({ gender }) => {
      await queryClient.cancelQueries({ queryKey: ["myInfo"] });
      const prevQueryData = queryClient.getQueryData<UserInfoResponse>([
        "myInfo",
      ]);

      queryClient.setQueryData(
        ["myInfo"],
        (prevQueryData?: UserInfoResponse) => {
          if (!prevQueryData) return prevQueryData;
          return {
            ...prevQueryData,
            content: {
              ...prevQueryData.content,
              gender: gender,
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

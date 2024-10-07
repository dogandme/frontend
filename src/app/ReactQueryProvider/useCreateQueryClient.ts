import { useRef } from "react";
import { QueryClient, QueryCache } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/store";
import { ERROR_MESSAGE } from "./constants";
import { getNewAccessToken } from "./errorHandlers";

export const useCreateQueryClient = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const resetAuthStore = useAuthStore((state) => state.reset);

  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          /**
           * 기본 retry 는 false 로 해둡니다.
           * Access, RefreshToken 에러 발생 시, 불필요한 retry 를 막기 위함입니다.
           * 만약 retry를 필요로 하는 경우에선 개별적인 query 문에서 retry 를 정의 해줍니다.
           */
          retry: false,
        },
        mutations: {
          /**
           * 기본 retry 는 false 로 해둡니다.
           * Access, RefreshToken 에러 발생 시, 불필요한 retry 를 막기 위함입니다.
           * 만약 retry를 필요로 하는 경우에선 개별적인 query 문에서 retry 를 정의 해줍니다.
           */
          retry: false,
        },
      },

      queryCache: new QueryCache({
        onError: async (error) => {
          switch (error.message) {
            case ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED: {
              await getNewAccessToken({
                setterMethods: { setToken, resetAuthStore },
                queryClient,
              });
              break;
            }
            default:
              throw error;
          }
        },
      }),
    }),
  ).current;

  return queryClient;
};

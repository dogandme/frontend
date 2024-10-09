import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/store";
import { ERROR_MESSAGE } from "./constants";
import { getNewAccessToken } from "./errorHandlers";

export const useCreateQueryClient = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const resetAuthStore = useAuthStore((state) => state.reset);
  const navigate = useNavigate();

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
                navigateMethod: { navigate },
                queryClient,
              });
              break;
            }
            default:
              throw error;
          }
        },
      }),
      mutationCache: new MutationCache({
        onError: async (error, variables, context, mutation) => {
          switch (error.message) {
            case ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED: {
              await getNewAccessToken({
                setterMethods: { setToken, resetAuthStore },
                navigateMethod: { navigate },
                queryClient,
              });

              const { options, state } = mutation;

              /**
               * 이전에 시도 했던 mutationFn 을 업데이트 된 액세스 토큰을 이용해 다시 시도합니다.
               * options.mutationFn 으로 재시도 하는 mutation의 경우엔 onSuccess, onError를 자동으로 호출하지 않습니다.
               * 이에 try,catch 문을 이용해 onSuccess, onError 를 수동으로 호출합니다.
               */
              try {
                const { token } = useAuthStore.getState();
                const updatedVariables = { ...(variables as object), token };
                await options.mutationFn?.(updatedVariables);
                options.onSuccess?.(state.data, updatedVariables, context);
              } catch (error) {
                options.onError?.(error, variables, context);
              }
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

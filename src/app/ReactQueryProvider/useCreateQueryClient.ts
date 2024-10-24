import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/store";
import { useOverlayStore } from "@/shared/store/overlay";
import { ERROR_MESSAGE } from "./constants";
import { getNewAccessToken } from "./errorHandlers";

export const useCreateQueryClient = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const resetAuthStore = useAuthStore((state) => state.reset);
  const navigate = useNavigate();
  const resetOverlays = useOverlayStore((state) => state.resetOverlays);

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
        onError: async (error, query) => {
          switch (error.message) {
            case ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED: {
              await getNewAccessToken({
                queryClient,
                callbackFunctions: { setToken, resetAuthStore, navigate },
              });
              queryClient.invalidateQueries({
                queryKey: query.queryKey,
              });
              break;
            }
            default:
              return;
          }
        },
      }),
      mutationCache: new MutationCache({
        onSuccess: (data, variables, context, mutation) => {
          // * 중복 닉네임 체크인 경우에만 모달을 닫지 않습니다.
          if (
            mutation.options.mutationKey?.includes("checkDuplicateNickname")
          ) {
            return;
          }

          if (useOverlayStore.getState().overlays.length > 0) {
            resetOverlays();
          }
        },
        onError: async (error, variables, context, mutation) => {
          switch (error.message) {
            case ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED: {
              await getNewAccessToken({
                queryClient,
                callbackFunctions: { setToken, resetAuthStore, navigate },
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
                // mutation이 성공하면 mutationCached에 존재하는 로직과 동일하게 모든 오버레이 닫기
                if (useOverlayStore.getState().overlays.length > 0) {
                  resetOverlays();
                }
                // 기존 mutation 의 onSuccess 호출
                options.onSuccess?.(state.data, updatedVariables, context);
              } catch (error) {
                options.onError?.(error, variables, context);
              }
              break;
            }
            default:
              /**
               * 만약 발생 한 에러가 전역으로 핸들링 할 에러가 아니라면
               * 아무런 행위도 하지 않습니다.
               * 2024/10/15 에서 throw error 문이 제거 되었습니다.
               * throw error 가 있을 경우 에러가 mutation.onError 에게 에러가 전달 되지 않고
               * 실행 스택이 중단 되어 mutation.onError 가 호출 되지 않았습니다.
               */
              return;
          }
        },
      }),
    }),
  ).current;

  return queryClient;
};

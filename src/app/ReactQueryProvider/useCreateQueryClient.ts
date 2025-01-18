import { useRef } from "react";
import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { HttpError } from "@/shared/lib";
import { useSnackbar } from "@/shared/store";
import { useRefreshToken } from "./errorHandlers";

export const useCreateQueryClient = () => {
  const handleSnackbarOpen = useSnackbar("default");
  const { refreshTokenAndRetry } = useRefreshToken();

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
          throwOnError(error) {
            return error instanceof HttpError && error.code >= 500;
          },
        },
        mutations: {
          /**
           * 기본 retry 는 false 로 해둡니다.
           * Access, RefreshToken 에러 발생 시, 불필요한 retry 를 막기 위함입니다.
           * 만약 retry를 필요로 하는 경우에선 개별적인 query 문에서 retry 를 정의 해줍니다.
           */
          retry: false,
          throwOnError(error) {
            return error instanceof HttpError && error.code >= 500;
          },
        },
      },

      queryCache: new QueryCache({
        onError: async (error, query) => {
          if (error instanceof HttpError && error.code === 401) {
            refreshTokenAndRetry(queryClient, query);
            return;
          }

          if (error instanceof HttpError && error.snackbarOnError) {
            handleSnackbarOpen(error.message);
          }
        },
      }),
      mutationCache: new MutationCache({
        onError: async (error, variables, _context, mutation) => {
          if (error instanceof HttpError && error.code === 401) {
            refreshTokenAndRetry(queryClient, undefined, mutation, variables);
            return;
          }

          if (error instanceof HttpError && error.snackbarOnError) {
            handleSnackbarOpen(error.message);
          }
        },
      }),
    }),
  ).current;

  return queryClient;
};

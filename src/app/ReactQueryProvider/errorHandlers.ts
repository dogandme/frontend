import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type {
  Mutation,
  Query,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { ROUTER_PATH } from "@/shared/constants";
import { HttpError } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { getAccessTokenByRefreshToken } from "../api";

interface FailedRequest {
  query?: Query<unknown, unknown, unknown, QueryKey>;
  mutation?: Mutation<unknown, unknown, unknown, unknown>;
  variables?: unknown;
}

export const useRefreshToken = () => {
  const navigate = useNavigate();
  const resetAuthStore = useAuthStore((state) => state.reset);

  // access token 갱신 중인지 여부
  const isRefreshing = useRef<boolean>(false);
  // 실패한 query나 mutation을 저장하는 queue
  const failedQueue = useRef<FailedRequest[]>([]);

  // access token 갱신 요청
  const updateAccessToken = async (queryClient: QueryClient) => {
    try {
      const {
        authorization: newToken,
        role,
        nickname,
      } = await getAccessTokenByRefreshToken();

      useAuthStore.setState({
        token: newToken,
        role,
        nickname,
      });
    } catch (error) {
      if (error instanceof HttpError && error.code === 401) {
        resetAuthStore();
        queryClient.clear();

        // 실패하면 failedQueue, isRefreshing 초기화
        isRefreshing.current = false;
        failedQueue.current = [];

        if (
          (
            window as Window &
              typeof globalThis & { __STORYBOOK_ADDONS_CHANNEL__?: unknown }
          ).__STORYBOOK_ADDONS_CHANNEL__
        ) {
          return;
        }

        navigate(ROUTER_PATH.LOGIN);
      }
    }
  };

  // 실패한 요청 재시도
  const retryRequest = () => {
    failedQueue.current.forEach(({ query, mutation, variables }) => {
      if (mutation) {
        mutation.execute(variables);
      }
      if (query) {
        query.fetch();
      }
    });

    isRefreshing.current = false;
    failedQueue.current = [];
  };

  // 토큰 갱신 후 요청 재시도
  const refreshTokenAndRetry = async (
    queryClient: QueryClient,
    query?: Query<unknown, unknown, unknown, QueryKey>,
    mutation?: Mutation<unknown, unknown, unknown, unknown>,
    variables?: unknown,
  ) => {
    if (!isRefreshing.current) {
      isRefreshing.current = true;
      failedQueue.current.push({ query, mutation, variables });

      await updateAccessToken(queryClient);

      retryRequest();
      return;
    }

    failedQueue.current.push({ query, mutation, variables });
  };

  return { refreshTokenAndRetry };
};

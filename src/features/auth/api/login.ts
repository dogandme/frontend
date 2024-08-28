import { useQuery, useMutation } from "@tanstack/react-query";
import { LOGIN_END_POINT } from "../constants";

export interface LoginResponse {
  code: number;
  message: string;
  content: {
    authorization: string;
    role: string;
    userId: number;
  };
}

export type OAuthServerName = Exclude<keyof typeof LOGIN_END_POINT, "EMAIL">;

/**
 * 해당 훅은 OAuthServerName이 주어지면 해당 OAuthServer로 로그인을 시도합니다.
 * 만약 OAuthServerName이 null일 경우엔 로그인을 시도하지 않습니다.
 */
export const useOauthLogin = (OAuthServerName: OAuthServerName | null) => {
  const isOauthLoginEnabled = OAuthServerName !== null;

  const query = useQuery<LoginResponse>({
    queryKey: ["OAuthLogin", OAuthServerName],
    queryFn: async () => {
      // 컴파일러에게 OAuthServerName이 null이 아님을 알려줍니다.
      const END_POINT = LOGIN_END_POINT[OAuthServerName!];
      const response = await fetch(END_POINT);
      if (!response.ok) {
        // TODO 에러 메시지 픽스하기
        throw new Error("예기치 못한 네트워크 오류가 발생했습니다.");
      }
      const data = await response.json();
      return data;
    },
    enabled: isOauthLoginEnabled,
  });

  return query;
};

interface EmailLoginFormData {
  email: string;
  password: string;
  persistLogin: boolean;
}

// TODO 리액트 쿼리를 활용하여 최적화 하기
export const usePostLoginForm = () => {
  const mutate = useMutation<LoginResponse, Error, EmailLoginFormData>({
    mutationFn: async (formData) => {
      const response = await fetch(LOGIN_END_POINT.EMAIL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("문제가 발생했습니다. 잠시 후 다시 이용해주세요");
      }
      if (data.code === 401) {
        throw new Error("아이디 또는 비밀번호를 다시 확인해 주세요");
      }

      return data;
    },
  });

  return mutate;
};

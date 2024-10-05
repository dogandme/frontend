import { http, HttpResponse } from "msw";
import { Meta, StoryObj } from "@storybook/react";
import { useAuthStore } from "@/shared/store";
import User from "../../mocks/data/user.json";
import { MyPage, NotRoleUserMyPage, RoleUserMyPage } from "./page";

export default {
  title: "Pages/my-page",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "마이페이지에서 유저와 강아지의 정보를 받아 상세 정보를 나타내는 컴포넌트입니다. 사용자의 권한에 따라 다른 UI를 렌더링 합니다. ROLE_USER 미만의 경우엔 좌측과 같은 페이지가 (네비게이션의 문구만 다름) , ROLE_USER 이상의 경우엔 우측과 같은 페이지가 렌더링 됩니다.",
      },
    },
  },
} as Meta;

export const Default = {
  render: () => {
    return (
      <div className="flex gap-4">
        <div className="w-96 border border-grey-200">
          <NotRoleUserMyPage role={null} nickname={null} />
        </div>
        <div className="w-96 border border-grey-200">
          <RoleUserMyPage
            role={"ROLE_USER"}
            nickname={"뽀송송"}
            followers={Array.from({ length: 10 }, (_, i) => i)}
            followings={Array.from({ length: 10 }, (_, i) => i)}
            pet={{
              profile: "/default-image.png",
              personalities: [
                "온순한",
                "애정이 많은",
                "사람을 좋아하는",
                "애교가 많은",
              ],
              name: "뽀송이",
              description:
                "안녕하세요 뽀송이입니다. 너무나도 귀엽죠 ? 푸항항항 반갑습니다",
              breed: "비숑프리제",
            }}
            tempCnt={10}
            markings={[
              { id: 1, image: "/default-image.png" },
              { id: 2, image: "/default-image.png" },
              { id: 3, image: "/default-image.png" },
              { id: 4, image: "/default-image.png" },
              { id: 5, image: "/default-image.png" },
            ]}
          />
        </div>
      </div>
    );
  },
};

/**
 * msw 폴더가 리팩토링 예정이기 때문에 핸들러를 스토리북 내부에서 정의 하도록 합니다.
 * 2024/10/05 기준으로 현재 핸들러들엔 stale ,fresh token 에 따른 로직이 존재하지 않습니다.
 * 이에 스토리북에서 따로 stale token 에 대한 핸들러를 정의하도록 합니다.
 */
const getMyProfileHandler = [
  http.get(`${import.meta.env.VITE_API_BASE_URL}/profile`, ({ request }) => {
    const token = request.headers.get("Authorization");

    if (token === "staleToken") {
      return HttpResponse.json(
        {
          code: 401,
          message: "토큰 검증에 실패했습니다.",
        },
        { status: 401 },
      );
    }

    return HttpResponse.json(User.ROLE_USER);
  }),
];

const getNewAccessTokenHandler = [
  http.get(`${import.meta.env.VITE_API_BASE_URL}/auth`, ({ cookies }) => {
    const refreshToken = cookies["refreshToken"];

    if (refreshToken !== "freshRefreshToken") {
      return HttpResponse.json(
        {
          code: 401,
          message: "RefreshToken 검증에 실패했습니다.",
        },
        {
          status: 401,
        },
      );
    }
    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        authorization: "freshAccessToken",
      },
    });
  }),
];

export const AccessTokenTest: StoryObj<typeof MyPage> = {
  parameters: {
    msw: {
      handlers: [...getMyProfileHandler, ...getNewAccessTokenHandler],
    },
  },

  decorators: [
    (Story) => {
      // 로그인 해뒀지만 토큰이 만료된 경우를 가정
      useAuthStore.setState({
        role: "ROLE_USER",
        nickname: "뽀송송",
        token: "staleToken",
      });

      return <Story />;
    },
  ],

  render: () => <MyPage />,
};

import { Meta } from "@storybook/react";
import { NotRoleUserMyPage, RoleUserMyPage } from "./page";

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
              { id: 1, images: "/default-image.png" },
              { id: 2, images: "/default-image.png" },
              { id: 3, images: "/default-image.png" },
              { id: 4, images: "/default-image.png" },
              { id: 5, images: "/default-image.png" },
            ]}
          />
        </div>
      </div>
    );
  },
};

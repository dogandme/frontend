import { StoryObj } from "@storybook/react";
import { DividerLine } from "./DividerLine";

export default {
  title: "shared/DividerLine",
  component: DividerLine,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "컴포넌트를 구분하는 선을 그리는 컴포넌트 입니다. axis 에 따라 가로 또는 세로로 선을 그립니다. 기본 배경색은 grey-200 입니다.  axis-col의 경우 높이는 w-[.75rem] , axis-row의 경우 너비는 w-full 이 기본 값입니다. 기본적으로 모든 디바이더 라인은 mx,my-auto 가 적용되어 있습니다. 이에 따라 w-100% 이하인 경우엔 중앙 정렬이 기본 값입니다.",
      },
    },
  },
};

type Story = StoryObj<typeof DividerLine>;

export const Default: Story = {
  render: () => {
    return (
      <div className="px-2 py-2 flex flex-col gap-4 w-96">
        <div>
          <h1 className="title-3">세로 선으로 사용 되는 경우</h1>
          <p className="flex items-center gap-2 ">
            <span className="body-3">도봉구 슈퍼맨</span>
            <DividerLine axis="col" />
            <span className="body-3">뽀송이</span>
          </p>
        </div>
        <div>
          <h1 className="title-3">가로 선으로 사용 되는 경우</h1>
          <div className="flex flex-col gap2  px-2 py-2">
            <div className="px-2 py-2 title-3 text-grey-500">
              개인 정보 수정
            </div>
            <DividerLine axis="row" />
            <div className="px-2 py-2 title-3 text-grey-500">알림</div>
          </div>
        </div>
        <div>
          <h1 className="title-3">
            가로 선으로 사용 되면서 너비를 커스텀 하고 싶은 경우
            <p>(w-4/5 적용)</p>
          </h1>

          <div className="flex flex-col justify-center gap2  px-2 py-2">
            <div className="px-2 py-2 title-3 text-grey-500">
              개인 정보 수정
            </div>
            <DividerLine axis="row" className="w-4/5" />
            <div className="px-2 py-2 title-3 text-grey-500">알림</div>
          </div>
        </div>
      </div>
    );
  },
};

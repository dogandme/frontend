import { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { OverlayPortal } from "@/app/OverlayPortal";
import {
  AnimationModalTrigger,
  ModalTrigger,
  NestedModalTrigger,
} from "./overlay.mock";

export default {
  title: "shared/overlay",
} as Meta;

/**
 * 해당 컴포넌트는 Modal 을 열고 Modal 저장 시 상단 스낵바가 노출되는 상황을 연출합니다.
 * Modal 은 disabledInteraction 옵션을 통해 외부 클릭을 막으며 모달을 제외한 영역을 클릭하면 모달이 닫힙니다.
 * Snackbar는 disabledInteraction 옵션이 존재하지 않습니다. 이에 스낵바가 뜬 채로 인터렉션을 할 수 있습니다.
 */
export const Default: StoryObj<typeof OverlayPortal> = {
  render: () => {
    return (
      <div>
        {/* html 태그라 가정 */}
        {/* 스크롤 위치와 상관 없이 Overlay 들이 잘 나타나는지 확인하기 위해 뷰포트 크기를 늘림 */}
        <div id="root" className="h-[200vh]">
          {/* Overlay 들이 나타날 공간 , 실제론 RouterProvider 외부에 존재한다. */}
          <OverlayPortal />
          <div className="flex h-screen items-center justify-center">
            <div className="w-96">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequatur recusandae ut neque illo, odit accusantium eum quam
                iste maiores, eveniet mollitia officia veritatis nostrum
                voluptas dolorum vel ipsam voluptatem eaque.
              </p>
              <div className="flex justify-end">
                <ModalTrigger />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $body = canvasElement.ownerDocument.body;
    const $button = canvas.getByRole("button");

    await step(
      "모달이 존재하지 않을 땐 모달 오버레이가 DOM 에 존재하지 않는다.",
      () => {
        const $modalOverlay = canvasElement.querySelector(".relative");
        expect($modalOverlay).toBeNull();
      },
    );

    await step(
      "사용자가 disabled interaction인 모달을 열면 모달이 나타난다.",
      async () => {
        await userEvent.click($button);
        expect(canvas.getByText("화면을 나가시겠습니까?")).toBeInTheDocument();

        await step("모달이 나타나면 body 태그의 스크롤은 막힌다.", () => {
          expect($body).toHaveStyle({ overflow: "hidden" });
        });

        await step(
          "사용자가 모달 내부 영역을 클릭하면 아무런 일이 일어나지 않는다.",
          async () => {
            const $modal = canvas.getByText("화면을 나가시겠습니까?");
            await userEvent.click($modal);
            expect($modal).toBeInTheDocument();
          },
        );

        await step(
          "사용자가 모달 외부 영역을 클릭하면 모달이 닫힌다.",
          async () => {
            const $modalOverlay =
              canvasElement.querySelector(".absolute.w-screen");
            await userEvent.click($modalOverlay!);
            expect(
              canvas.queryByText("나가시겠습니까?"),
            ).not.toBeInTheDocument();
          },
        );
      },
    );

    await step(
      '사용자가 모달의 저장하고 나가기를 누르면 "저장이 되었습니다" 스낵바가 나타난다.',
      async () => {
        await userEvent.click($button);
        const $saveButton = canvas.getByText("저장하고 나가기");

        await userEvent.click($saveButton);
        expect(canvas.getByText("저장이 되었습니다")).toBeInTheDocument();
      },
    );

    // 스낵바는 1초뒤에 사라지기에 1초간 대기
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await step(
      "사용자가 모달의 그냥 나가기를 누르면 스낵바가 나타나지 않는다.",
      async () => {
        await userEvent.click($button);
        const $exitButton = canvas.getByText("그냥 나가기");

        await userEvent.click($exitButton);
        expect(canvas.queryByText("저장이 되었습니다")).not.toBeInTheDocument();
      },
    );
  },
};

export const Nested = {
  render: () => {
    return (
      <div>
        {/* html 태그라 가정 */}
        {/* 스크롤 위치와 상관 없이 Overlay 들이 잘 나타나는지 확인하기 위해 뷰포트 크기를 늘림 */}
        <div id="root" className="h-[200vh]">
          {/* Overlay 들이 나타날 공간 , 실제론 RouterProvider 외부에 존재한다. */}
          <OverlayPortal />
          <div className="flex h-screen items-center justify-center">
            <div className="w-96">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequatur recusandae ut neque illo, odit accusantium eum quam
                iste maiores, eveniet mollitia officia veritatis nostrum
                voluptas dolorum vel ipsam voluptatem eaque.
              </p>
              <div className="flex justify-end">
                <NestedModalTrigger />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const AnimationModal = {
  render: () => {
    return (
      <div>
        {/* html 태그라 가정 */}
        {/* 스크롤 위치와 상관 없이 Overlay 들이 잘 나타나는지 확인하기 위해 뷰포트 크기를 늘림 */}
        <div id="root" className="h-[200vh]">
          {/* Overlay 들이 나타날 공간 , 실제론 RouterProvider 외부에 존재한다. */}
          <OverlayPortal />
          <div className="flex h-screen items-center justify-center">
            <div className="w-96">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequatur recusandae ut neque illo, odit accusantium eum quam
                iste maiores, eveniet mollitia officia veritatis nostrum
                voluptas dolorum vel ipsam voluptatem eaque.
              </p>
              <div className="flex justify-end">
                <AnimationModalTrigger />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

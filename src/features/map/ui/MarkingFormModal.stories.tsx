import { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { OverlayPortal } from "@/app/OverlayPortal";
import { MapPage } from "@/pages/map";
import { GoogleMaps } from "@/widgets/map/ui";
import { useAuthStore } from "@/shared/store";
import { GoogleMapsProvider, MobileLayout } from "@/app";
import { markingModalHandlers } from "@/mocks/handler";
import { useMapStore } from "../store/map";
import { MarkingFormModal } from "./MarkingFormModal";

const meta: Meta<typeof MarkingFormModal> = {
  title: "features/map/MarkingFormModal",
  component: MarkingFormModal,
};

export default meta;

type Story = StoryObj<typeof MarkingFormModal>;

export const Default: Story = {
  decorators: [
    (Story) => {
      useAuthStore.setState({ token: "Bearer token" });
      useMapStore.setState({ mode: "view" });

      return (
        <div id="root">
          <GoogleMapsProvider>
            <GoogleMaps>
              <MobileLayout>
                <OverlayPortal />
                <Story />
              </MobileLayout>
            </GoogleMaps>
          </GoogleMapsProvider>
        </div>
      );
    },
  ],

  parameters: {
    msw: {
      handlers: [...markingModalHandlers],
    },
  },

  render: () => <MapPage />,

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const EXIT_BUTTON_LABEL = "마커 추가 모드 종료하기";
    const STRING_ADDRESS = "서울특별시 강남구 역삼동 123-456";

    await step(
      "페이지가 view 모드에서 렌더링 되었을 때 마킹하기 버튼이 존재 한다.",
      async () => {
        const $markingButton = await canvas.findByText("마킹하기");
        expect($markingButton).toBeVisible();
      },
    );

    step("마킹하기 버튼이 눌리면 edit 모드로 변경 된다.", async () => {
      const $markingButton = await canvas.findByText("마킹하기");
      await userEvent.click($markingButton);

      const $markingModalTriggerButton =
        await canvas.findByText("여기에 마킹하기")!;
      const $editModeExitButton =
        await canvas.findByLabelText(EXIT_BUTTON_LABEL)!;

      expect($markingModalTriggerButton).toBeVisible();
      expect($editModeExitButton).toBeVisible();
    });

    await step("exit 버튼을 누르면 view 모드로 변경 된다.", async () => {
      const $markingModalTriggerButton =
        await canvas.findByText("여기에 마킹하기")!;
      const $editModeExitButton =
        await canvas.findByLabelText(EXIT_BUTTON_LABEL)!;

      await userEvent.click($editModeExitButton);

      const $markingButton = await canvas.findByText("마킹하기");
      expect($markingButton).toBeVisible();
      expect($markingModalTriggerButton).not.toBeInTheDocument();
      expect($editModeExitButton).not.toBeInTheDocument();
    });

    await step(
      "edit 모드에서 여기에 마킹하기 버튼을 클릭하면 모달 폼이 나타난다.",
      async () => {
        // 마킹 모드 돌입
        const $markingButton = await canvas.findByText("마킹하기");
        await userEvent.click($markingButton);

        const $markingModalTriggerButton =
          await canvas.findByText("여기에 마킹하기");
        await userEvent.click($markingModalTriggerButton);

        const $markingForm = await canvasElement.querySelector("form");
        expect($markingForm).toBeVisible();
      },
    );

    await step(
      `마킹 모달 폼에선 위경도 정보로 사용자의 현재 도로명 주소인 ${STRING_ADDRESS} 가져와 렌더링 한다.`,
      async () => {
        const $markingAddress = await canvas.findByText(STRING_ADDRESS);
        expect($markingAddress).toBeVisible();
      },
    );

    // ! 이유는 모르겠으나 스토리북에서 STRING_ADDRESS 를 클릭하면 스토리북이 터진다.
    // ! 그래서 STRING_ADDRESS 를 클릭하는 테스트는 제외하고 진행한다.
    // ! 사용하면 STRING_ADDRESS 를 클릭하면 이전 모드로 잘 이동하는 것을 확인할 수 있다.
  },
};

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

        const $markingFormSubmitButton = await canvas.findByText("저장하기");
        expect($markingFormSubmitButton).toBeVisible();
      },
    );

    await step(
      `마킹 모달 폼에선 위경도 정보로 사용자의 현재 도로명 주소인 ${STRING_ADDRESS} 가져와 렌더링 한다.`,
      async () => {
        const $markingAddress = await canvas.findByText(STRING_ADDRESS);
        expect($markingAddress).toBeVisible();
      },
    );

    await step(
      "마킹 모달 폼에서 현재 도로명 주소를 클릭하면 모달이 닫히고 edit 모드가 유지 된다.",
      async () => {
        const $markingAddress = await canvas.findByText(STRING_ADDRESS);
        const $markingFormSubmitButton = await canvas.findByText("저장하기");

        await userEvent.click($markingAddress);
        expect($markingFormSubmitButton).not.toBeInTheDocument();

        const $markingModalTriggerButton =
          await canvas.findByText("여기에 마킹하기");
        expect($markingModalTriggerButton).toBeVisible();
      },
    );

    await step(
      "edit 모드에서 지도를 일정 부분 이동하고 모달을 다시 열면 새로운 주소에 대한 도로명 주소가 나타난다.",
      async () => {
        // 드래그 시작 위치
        const startElement = canvas.getAllByLabelText("지도")[0];
        const startBoundingBox = startElement.getBoundingClientRect();
        const startX = startBoundingBox.left + startBoundingBox.width / 2;
        const startY = startBoundingBox.top + startBoundingBox.height / 2;

        // 드래그 종료 위치 (예: 100px 오른쪽, 50px 아래로 드래그)
        const endX = startX + 100;
        const endY = startY + 50;

        // 드래그 동작 시뮬레이션
        await userEvent.pointer([
          {
            keys: "[MouseLeft]",
            target: startElement,
            coords: { x: startX, y: startY },
          },
          { coords: { x: endX, y: endY } },
          { keys: "[/MouseLeft]", coords: { x: endX, y: endY } },
        ]);

        // 모달 다시 열기
        const $markingModalTriggerButton =
          await canvas.findByText("여기에 마킹하기");
        await userEvent.click($markingModalTriggerButton);

        // 새로운 주소에 대한 도로명 주소 확인
        const $newAddress =
          await canvas.findByText("새로운 도로명 주소 텍스트");
        expect($newAddress).toBeVisible();
      },
    );
  },
};

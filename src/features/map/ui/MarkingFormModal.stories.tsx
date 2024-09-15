import { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { OverlayPortal } from "@/app/OverlayPortal";
import { MapPage } from "@/pages/map";
import { GoogleMaps } from "@/widgets/map/ui";
import { useAuthStore } from "@/shared/store";
import { GoogleMapsProvider, MobileLayout } from "@/app";
import { markingModalHandlers } from "@/mocks/handler";
import { MarkingModalText, MarkingModalLabel } from "../constants";
import { useMarkingFormStore } from "../store/form";
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
    const STRING_ADDRESS = "서울특별시 강남구 역삼동 123-456";

    await step(
      "페이지가 view 모드에서 렌더링 되었을 때 마킹하기 버튼이 존재 한다.",
      async () => {
        const $markingButton = await canvas.findByText(
          MarkingModalText.markingEditButton,
        );
        expect($markingButton).toBeVisible();
      },
    );

    step("마킹하기 버튼이 눌리면 edit 모드로 변경 된다.", async () => {
      const $markingButton = await canvas.findByText(
        MarkingModalText.markingEditButton,
      );
      await userEvent.click($markingButton);

      const $markingModalTriggerButton = await canvas.findByText(
        MarkingModalText.markingFormTriggerButton,
      )!;
      const $editModeExitButton = await canvas.findByLabelText(
        MarkingModalLabel.exitEditButton,
      )!;
      const $editModeSnackbar = canvas.getByText(
        "마킹 위치를 손가락으로 움직여서 선택해 주세요",
      );

      expect($markingModalTriggerButton).toBeVisible();
      expect($editModeExitButton).toBeVisible();
      expect($editModeSnackbar).toBeVisible();
    });

    await step("exit 버튼을 누르면 view 모드로 변경 된다.", async () => {
      const $markingModalTriggerButton = await canvas.findByText(
        MarkingModalText.markingFormTriggerButton,
      )!;
      const $editModeExitButton = await canvas.findByLabelText(
        MarkingModalLabel.exitEditButton,
      )!;

      await userEvent.click($editModeExitButton);

      const $markingButton = await canvas.findByText(
        MarkingModalText.markingEditButton,
      );
      expect($markingButton).toBeVisible();
      expect($markingModalTriggerButton).not.toBeInTheDocument();
      expect($editModeExitButton).not.toBeInTheDocument();
    });

    await step(
      "edit 모드에서 여기에 마킹하기 버튼을 클릭하면 모달 폼이 나타난다.",
      async () => {
        // 마킹 모드 돌입
        const $markingButton = await canvas.findByText(
          MarkingModalText.markingEditButton,
        );
        await userEvent.click($markingButton);

        const $markingModalTriggerButton = await canvas.findByText(
          MarkingModalText.markingFormTriggerButton,
        );
        await userEvent.click($markingModalTriggerButton);

        const $markingFormSubmitButton = await canvas.findByText(
          MarkingModalText.saveButton,
        );
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
        const $markingFormSubmitButton = await canvas.findByText(
          MarkingModalText.saveButton,
        );

        await userEvent.click($markingAddress);
        expect($markingFormSubmitButton).not.toBeInTheDocument();

        const $markingModalTriggerButton = await canvas.findByText(
          MarkingModalText.markingFormTriggerButton,
        );
        expect($markingModalTriggerButton).toBeVisible();
      },
    );

    await step("마킹 모달에 작성한 내용은 스토어에 잘 저장 된다.", async () => {
      const $markingModalTriggerButton = await canvas.findByText(
        MarkingModalText.markingFormTriggerButton,
      );
      await userEvent.click($markingModalTriggerButton);

      const $postVisibilityOpener = await canvas.findByText(
        MarkingModalText.postVisibilityPlaceHolder,
      );
      const $textArea = await canvas.findByPlaceholderText(
        MarkingModalText.markingTextAreaPlaceholder,
      );
      const $fileUploadInput = canvasElement.querySelector(
        "#images",
      ) as HTMLInputElement;

      // 공개 범위 설정
      await $postVisibilityOpener.click();
      const $publicVisibility = await canvas.findByText("전체 공개");
      await $publicVisibility.click();

      // 이미지 파일 업로드

      const dummyFiles = [
        new File([""], "test1.jpg", { type: "image/jpg", lastModified: 1 }),
        new File([""], "test2.jpg", { type: "image/png", lastModified: 2 }),
        new File([""], "test3.jpg", { type: "image/jpeg", lastModified: 3 }),
        new File([""], "test4.jpg", { type: "image/webp", lastModified: 4 }),
      ];

      await userEvent.upload($fileUploadInput, dummyFiles);

      // 내용 작성
      await userEvent.type($textArea, "여기는 진짜 대박이긴 해요");

      const { content, visibility, images } = useMarkingFormStore.getState();
      expect(content).toBe("여기는 진짜 대박이긴 해요");
      expect(visibility).toBe("전체 공개");
      expect(images).toHaveLength(4);
      expect(images.map((file) => file.name)).toEqual(
        dummyFiles.map((file) => file.name),
      );
    });

    await step(
      "이미지 파일 업로드는 다음과 같은 결과들을 만족 해야 한다.",
      async () => {
        const $fileUploadInput = canvasElement.querySelector(
          "#images",
        )! as HTMLInputElement;

        const $fileUploadButton = canvas.getByLabelText(
          MarkingModalLabel.photoInputAddButton,
        );

        const originalImagesLength =
          useMarkingFormStore.getState().images.length;

        await step(
          "이미지 파일이 5장 이하 일 때엔 사진 추가 버튼이 존재 한다.",
          async () => {
            expect($fileUploadButton).toBeVisible();
          },
        );

        await step("중복된 이미지 파일은 업로드 되지 않는다.", async () => {
          await userEvent.upload(
            $fileUploadInput,
            new File([""], "test3.jpg", {
              type: "image/jpeg",
              lastModified: 3,
            }),
          );
          expect(useMarkingFormStore.getState().images).toHaveLength(
            originalImagesLength,
          );
        });

        await step(
          "새로운 파일을 추가로 업로드 하여도 기존 이미지 파일들은 존재 한다.",
          async () => {
            const dummyFiles = [
              new File([""], "test5.jpg", {
                type: "image/jpg",
                lastModified: 5,
              }),
            ];

            await userEvent.upload($fileUploadInput, dummyFiles);
            expect(useMarkingFormStore.getState().images).toHaveLength(
              originalImagesLength + 1,
            );
          },
        );

        await step("사진이 5장이 되면 사진 추가 버튼이 사라진다.", async () => {
          expect($fileUploadButton).not.toBeVisible();
        });
      },
    );

    await step("나가기 버튼을 클릭하면 확인 모달이 나타난다.", async () => {
      const $exitButton = canvas.getByLabelText("작성중인 마킹 게시글 닫기");
      await userEvent.click($exitButton);

      const $confirmModal = await canvas.findByText("화면을 나가시겠습니까");
      await expect($confirmModal).toBeVisible();

      const $cancelButton = await canvas.findByText("취소");
      await userEvent.click($cancelButton);
      await expect($confirmModal).not.toBeVisible();
    });

    await step(
      "edit 모드를 유지한 채로 나갔다가 다시 모달을 열어도 내용이 유지 된다.",
      async () => {
        const originalState = useMarkingFormStore.getState();

        const $markingAddress = await canvas.findByText(STRING_ADDRESS);
        await userEvent.click($markingAddress);

        const $markingModalTriggerButton = await canvas.findByText(
          MarkingModalText.markingFormTriggerButton,
        );
        await userEvent.click($markingModalTriggerButton);

        expect(useMarkingFormStore.getState()).toEqual(originalState);
      },
    );

    await step(
      "나갈 때 view 모드로 나갈 경우엔 모달 내부 내용이 초기화 된다.",
      async () => {
        const $exitButton = await canvas.findByLabelText(
          MarkingModalLabel.confirmModalCloseButton,
        );
        await userEvent.click($exitButton);

        const $confirmModal = await canvas.findByText("화면을 나가시겠습니까");
        await expect($confirmModal).toBeVisible();

        const $exitEditModeButton = await canvas.findByText("나가기");
        await userEvent.click($exitEditModeButton);

        const { content, visibility, images } = useMarkingFormStore.getState();
        expect(content).toBe("");
        expect(visibility).toBe("");
        expect(images).toHaveLength(0);

        const $markingButton = await canvas.findByText(
          MarkingModalText.markingEditButton,
        );
        expect($markingButton).toBeVisible();
      },
    );

    await step(
      "임시 저장이 성공하면 view 모드로 변경 되고 스낵 바가 나타난다.",
      async () => {
        const $markingButton = await canvas.findByText(
          MarkingModalText.markingEditButton,
        );
        await userEvent.click($markingButton);

        const $markingModalTriggerButton = await canvas.findByText(
          MarkingModalText.markingFormTriggerButton,
        );
        await userEvent.click($markingModalTriggerButton);

        const $fileUploadInput = canvasElement.querySelector(
          "#images",
        ) as HTMLInputElement;
        const dummyFiles = [
          new File([""], "test1.jpg", { type: "image/jpg", lastModified: 1 }),
          new File([""], "test2.jpg", { type: "image/png", lastModified: 2 }),
          new File([""], "test3.jpg", { type: "image/jpeg", lastModified: 3 }),
          new File([""], "test4.jpg", { type: "image/webp", lastModified: 4 }),
        ];
        await userEvent.upload($fileUploadInput, dummyFiles);

        const $postVisibilityOpener = await canvas.findByText(
          MarkingModalText.postVisibilityPlaceHolder,
        );
        await $postVisibilityOpener.click();
        const $publicVisibility = await canvas.findByText("전체 공개");
        await $publicVisibility.click();

        const $textArea = await canvas.findByPlaceholderText(
          MarkingModalText.markingTextAreaPlaceholder,
        );
        await userEvent.type($textArea, "여기는 진짜 대박이긴 해요");

        const $markingFormSubmitButton = await canvas.findByText(
          MarkingModalText.tempSaveButton,
        );
        await userEvent.click($markingFormSubmitButton);

        const $snackBar = await canvas.findByText(
          MarkingModalText.tempSaveSnackbar1,
        );
        expect($snackBar).toBeVisible();
        expect(useMapStore.getState().mode).toBe("view");

        const { content, visibility, images } = useMarkingFormStore.getState();
        expect(content).toBe("");
        expect(visibility).toBe("");
        expect(images).toHaveLength(0);
      },
    );

    await step(
      "저장이 성공하면 view 모드로 변경 되고 스낵 바가 나타난다.",
      async () => {
        const $markingButton = await canvas.findByText(
          MarkingModalText.markingEditButton,
        );
        await userEvent.click($markingButton);

        const $markingModalTriggerButton = await canvas.findByText(
          MarkingModalText.markingFormTriggerButton,
        );
        await userEvent.click($markingModalTriggerButton);

        const $fileUploadInput = canvasElement.querySelector(
          "#images",
        ) as HTMLInputElement;
        const dummyFiles = [
          new File([""], "test1.jpg", { type: "image/jpg", lastModified: 1 }),
          new File([""], "test2.jpg", { type: "image/png", lastModified: 2 }),
          new File([""], "test3.jpg", { type: "image/jpeg", lastModified: 3 }),
          new File([""], "test4.jpg", { type: "image/webp", lastModified: 4 }),
        ];
        await userEvent.upload($fileUploadInput, dummyFiles);

        const $postVisibilityOpener = await canvas.findByText(
          MarkingModalText.postVisibilityPlaceHolder,
        );
        await $postVisibilityOpener.click();
        const $publicVisibility = await canvas.findByText("전체 공개");
        await $publicVisibility.click();

        const $textArea = await canvas.findByPlaceholderText(
          MarkingModalText.markingTextAreaPlaceholder,
        );
        await userEvent.type($textArea, "여기는 진짜 대박이긴 해요");

        const $markingFormSubmitButton = await canvas.findByText(
          MarkingModalText.saveButton,
        );
        await userEvent.click($markingFormSubmitButton);

        const $snackBar = await canvas.findByText(
          MarkingModalText.saveMarkingSnackbar,
        );
        expect($snackBar).toBeVisible();
        expect(useMapStore.getState().mode).toBe("view");

        const { content, visibility, images } = useMarkingFormStore.getState();
        expect(content).toBe("");
        expect(visibility).toBe("");
        expect(images).toHaveLength(0);
      },
    );
  },
};

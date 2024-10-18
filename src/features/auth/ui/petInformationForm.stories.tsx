import { http, HttpResponse } from "msw";
import { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { OverlayPortal } from "@/app/OverlayPortal";
import { useAuthStore } from "@/shared/store/auth";
import { getProfileHandlers } from "@/mocks/handler";
import { PetInformationForm } from "./petInformationForm";

const meta: Meta<typeof PetInformationForm> = {
  title: "features/auth/PetInformationForm",
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<typeof PetInformationForm> = {
  parameters: {
    msw: {
      handlers: [
        [
          http.post("http://localhost/pets", async () => {
            return HttpResponse.json({
              code: 200,
              message: "success",
              content: {
                role: "ROLE_USER",
                authorization: "freshAccessToken",
              },
            });
          }),
        ],
        getProfileHandlers,
      ],
    },
  },

  decorators: (Story) => {
    useAuthStore.setState({
      nickname: "뽀송송",
      token: "Bearer token",
      role: "ROLE_GUEST",
    });

    return (
      <div id="root">
        <OverlayPortal />
        <Story />
      </div>
    );
  },

  render: () => (
    <div className="mx-auto w-96">
      <PetInformationForm />
    </div>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $profile = canvas.getByLabelText("profile-image-button")!;
    const $name = canvasElement.querySelector("#name")!;
    const $statusText = canvasElement.querySelectorAll("p")?.[1];
    const $breed = canvasElement.querySelector("#breed")!;
    const $selectedBreedName = $breed.querySelector("span")!;
    const $unknownBreed = canvasElement.querySelector("#unknown-breed")!;
    const $characterButton1 = canvas.queryByText("호기심 많은");
    const $characterButton2 = canvas.queryByText("애착이 강한");
    const $textarea = canvasElement.querySelector("#introduce")!;
    const $submit = canvas.getByText("등록하기");
    const $bottomSheet = document.querySelector("#profile-bottom-sheet")!;

    const clearAll = async () => {
      await userEvent.clear($name);
      await userEvent.clear($textarea);
    };

    await clearAll();

    await step("모든 컴포넌트들이 Actual DOM에 존재한다.", () => {
      expect($name).toBeInTheDocument();
      expect($breed).toBeInTheDocument();
      expect($unknownBreed).toBeInTheDocument();
      expect($characterButton1).toBeInTheDocument();
      expect($characterButton2).toBeInTheDocument();
      expect($textarea).toBeInTheDocument();
      expect($submit).toBeInTheDocument();
      expect($bottomSheet).toBeInTheDocument();
    });

    await step("기본 기능 테스트", async () => {
      await step("사진 선택 시 바텀 시트는 적절히 나타난다.", async () => {
        await userEvent.click($profile);
        const $bottomSheetContent = document.querySelector(
          ".react-modal-sheet-content ",
        )!;
        expect($bottomSheetContent).toBeInTheDocument();

        const $backdrop = document.querySelector(
          ".react-modal-sheet-backdrop",
        )!;
        await userEvent.click($backdrop);
        await waitFor(() => {
          expect($bottomSheetContent).not.toBeInTheDocument();
        });
      });
      await step(
        "종 입력란을 클릭 시 바텀 시트는 적절히 나타난다.",
        async () => {
          await userEvent.click($breed);
          const $bottomSheetContent = document.querySelector(
            ".react-modal-sheet-content ",
          )!;

          expect($bottomSheetContent).toBeInTheDocument();
          const $backdrop = document.querySelector(
            ".react-modal-sheet-backdrop",
          )!;
          await userEvent.click($backdrop);
          await waitFor(() => {
            expect($bottomSheetContent).not.toBeInTheDocument();
          });
        },
      );
      await step(
        "한글 혹은 영문이 아닌 문자를 입력하면 에러 메시지가 나타난다.",
        async () => {
          await userEvent.type($name, "123");
          await expect($statusText).toHaveClass("text-pink-500");
          await userEvent.clear($name);
          await userEvent.type($name, "ㄱㄴㄷ");
          await expect($statusText).toHaveClass("text-pink-500");
          await userEvent.clear($name);
        },
      );

      await step(
        "이름에 특수 문자를 입력하면 문자가 입력되지 않는다.",
        async () => {
          await userEvent.type($name, "abc!");
          await expect($name).toHaveValue("abc");
          await userEvent.clear($name);
        },
      );

      await step("이름은 최대 글자는 20글자만 입력 된다.", async () => {
        const maxName = "가".repeat(20);
        const extraName = "나";

        await userEvent.type($name, maxName + extraName);
        await expect($name).toHaveValue(maxName);
        await userEvent.clear($name);
      });

      await step("종 입력란을 클릭하면 바텀 시트가 나타난다.", async () => {
        await userEvent.click($breed);
        const $bottomSheetContent = document.querySelector(
          ".react-modal-sheet-content ",
        )!;

        expect($bottomSheetContent).toBeInTheDocument();

        await step(
          "바텀 시트에서 특정 견종을 클릭하면 입력란에 값이 채워지고 바텀 시트가 내려간다.",
          async () => {
            await userEvent.click(document.querySelector("#푸들")!);
            const $selectedBreedName = $breed.querySelector("span");
            expect($selectedBreedName).toHaveTextContent("푸들");
            await waitFor(() => {
              expect($bottomSheetContent).not.toBeInTheDocument();
            });
          },
        );
      });

      await step(
        "'모르겠어요'를 클릭하면 종 입력란에 '모르겠어요'로 값이 바뀌며 종 입력란이 disabled가 된다.",
        async () => {
          await userEvent.click($unknownBreed);
          expect($selectedBreedName).toHaveTextContent("모르겠어요");
          expect($breed).toBeDisabled();
        },
      );

      await step(
        "'모르겠어요' 선택된 상황에서 '모르겠어요'를 클릭하면 종 입력란은 초기 값으로 돌아온다.",
        async () => {
          await userEvent.click($unknownBreed);
          expect($selectedBreedName).toHaveTextContent("품종을 선택해 주세요");
          expect($breed).not.toBeDisabled();
        },
      );

      /**
       * 단위테스트를 시행한 셀레트 칩에 대한 테스트 코드는 진행하지 않습니다.
       */

      // 캐릭터 버튼 클릭
      await userEvent.click($characterButton1!);
      await userEvent.click($characterButton2!);

      await step(
        "간단히 소개해주세요 란은 최대 150자의 글을 입력 할 수 있다.",
        async () => {
          const maxIntroduce = "안녕하세요".repeat(30);
          const extraIntroduce = "나";
          await userEvent.type($textarea, maxIntroduce + extraIntroduce);
          await expect($textarea).toHaveValue(maxIntroduce);
        },
      );
    });

    await step("submit 버튼 유효성 테스트", async () => {
      const clearAll = async () => {
        await userEvent.clear($name);
        await userEvent.clear($textarea);
      };

      // 모든 입력 내용 지우기
      await clearAll();

      // 아무 내용도 입력하지 않고 submit 버튼을 누른 경우
      await step(
        "아무내용도 입력하지 않고 submit 버튼을 누르면 스낵바가 뜬다.",
        async () => {
          await userEvent.click($submit);
          const snackBarCloseButton =
            await canvas.getByLabelText("스낵바 닫기");

          await expect(
            canvas.getByText("필수 항목을 모두 입력해 주세요"),
          ).toBeVisible();

          await userEvent.click(snackBarCloseButton);
        },
      );

      // 이름만 입력 한 경우
      await step(
        "이름만 입력하고 submit 버튼을 누르면 스낵바가 뜬다.",
        async () => {
          await userEvent.click($submit);
          await expect(
            canvas.getByText("필수 항목을 모두 입력해 주세요"),
          ).toBeVisible();

          await step(
            "스낵바 닫힘 버튼을 클릭하면 스낵바가 사라진다.",
            async () => {
              const snackBarCloseButton =
                await canvas.getByLabelText("스낵바 닫기");

              await userEvent.click(snackBarCloseButton);
              await expect(snackBarCloseButton).not.toBeInTheDocument();
            },
          );
        },
      );

      await clearAll();

      // 이름이 유효성을 만족하지 않는 경우
      await step(
        "이름이 유효성을 만족하지 않은 채로 submit 버튼을 누르면 스낵바가 뜬다.",
        async () => {
          await userEvent.click($submit);

          await expect(
            canvas.getByText("필수 항목을 모두 입력해 주세요"),
          ).toBeVisible();

          await step(
            "스낵바 닫힘 버튼을 클릭하면 스낵바가 사라진다.",
            async () => {
              const snackBarCloseButton =
                await canvas.getByLabelText("스낵바 닫기");

              await userEvent.click(snackBarCloseButton);
              await expect(snackBarCloseButton).not.toBeInTheDocument();
            },
          );
        },
      );

      await clearAll();

      await step(
        "이름과 종을 유효성에 맞게 입력하고 submit 버튼을 누르면 스낵바가 뜨지 않는다.",

        async () => {
          await userEvent.type($name, "초코");
          await userEvent.click($breed);
          await userEvent.click(document.querySelector("#푸들")!);

          await userEvent.click($submit);

          expect(
            canvas.queryByText("필수 항목을 모두 입력해 주세요"),
          ).not.toBeInTheDocument();
        },
      );

      await clearAll();

      await step(
        "이름을 유효성에 맞게 입력하고 breed 를 mix로 선택하고 submit 버튼을 누르면 스낵바가 뜨지 않는다.",
        async () => {
          await userEvent.type($name, "초코");
          // breed를 mix 로 하였을 경우
          await userEvent.click($unknownBreed!);
          await userEvent.click($submit);

          expect(
            canvas.queryByText("필수 항목을 모두 입력해 주세요"),
          ).toBeNull();
          await userEvent.click($unknownBreed!);
        },
      );
    });

    await clearAll();

    await step(
      "올바른 API 요청이 전송되면 role 에 값이 저장된다.",
      async () => {
        await userEvent.type($name, "초코");
        await userEvent.click($breed);
        await userEvent.click(document.querySelector("#푸들")!);
        await userEvent.click($characterButton1!);
        await userEvent.click($characterButton2!);
        await userEvent.type(
          $textarea,
          "안녕하세요 너무 귀여운 강아지 입니다.",
        );

        await userEvent.click($submit);

        const { role, token } = useAuthStore.getState();
        expect(role).toBe("ROLE_USER");
        expect(token).toBe("freshAccessToken");
      },
    );
  },
};

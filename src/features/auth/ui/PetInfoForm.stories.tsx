import { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import * as PetInfoForm from "./PetInfoForm";
import { expect, userEvent, within } from "@storybook/test";
import { useAuthStore } from "@/shared/store/auth";
import { usePetInfoStore } from "../store";
import { OverlayPortal } from "@/app/OverlayPortal";

const _PetInfoForm = () => (
  <PetInfoForm.Form>
    <PetInfoForm.ProfileInput />
    <PetInfoForm.NameInput />
    <PetInfoForm.BreedInput />
    <PetInfoForm.CharacterInput />
    <PetInfoForm.IntroduceTextArea />
    <PetInfoForm.SubmitButton />
  </PetInfoForm.Form>
);

const meta: Meta<typeof _PetInfoForm> = {
  title: "features/auth/PetInfoForm",
  tags: ["autodocs"],
  component: _PetInfoForm,
};

export default meta;

// TODO 사진 업로드 기능은 어떻게 테스트 할 수 있을까?
export const Default: StoryObj<typeof _PetInfoForm> = {
  parameters: {
    msw: {
      // TODO 공식문서 보고 타입 선언 하기
      handlers: [
        http.post("http://localhost/pets", async () => {
          return HttpResponse.json({
            code: 200,
            message: "success",
            content: {
              role: "USER_USER",
            },
          });
        }),
      ],
    },
  },

  decorators: (Story) => {
    usePetInfoStore.setState({
      name: "",
      isValidName: true,
      breed: "",
      characterList: [],
      introduce: "",
    });

    useAuthStore.setState({
      token: "Bearer token",
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
      <PetInfoForm.Form>
        <PetInfoForm.ProfileInput />
        <PetInfoForm.NameInput />
        <PetInfoForm.BreedInput />
        <PetInfoForm.CharacterInput />
        <PetInfoForm.IntroduceTextArea />
        <PetInfoForm.SubmitButton />
      </PetInfoForm.Form>
    </div>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $name = canvasElement.querySelector("#name")!;
    const $statusText = canvasElement.querySelectorAll("p")?.[1];
    const $breed = canvasElement.querySelector("#breed")!;
    const $mix = canvasElement.querySelector("#isMixDog");
    const $characterButton1 = canvas.queryByText("호기심 많은");
    const $characterButton2 = canvas.queryByText("애착이 강한");
    const $textarea = canvasElement.querySelector("#introduce")!;

    const $submit = await canvas.getByText("등록하기");

    const clearAll = async () => {
      await userEvent.clear($name);
      await userEvent.clear($textarea);

      const { characterList } = usePetInfoStore.getState();
      characterList.forEach((character) => {
        if (character === "호기심 많은") {
          userEvent.click($characterButton1!);
        }
        if (character === "애착이 강한") {
          userEvent.click($characterButton2!);
        }
      });
    };

    await clearAll();

    await step("모든 컴포넌트들이 Actual DOM에 존재한다.", () => {
      expect($name).toBeInTheDocument();
      expect($breed).toBeInTheDocument();
      expect($mix).toBeInTheDocument();
      expect($characterButton1).toBeInTheDocument();
      expect($characterButton2).toBeInTheDocument();
      expect($textarea).toBeInTheDocument();
      expect($submit).toBeInTheDocument();
    });

    await step("기본 기능 테스트", async () => {
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

      // TODO : 바텀 시트 도입 시 테스트 코드 추가하기
      await step(
        "종 입력란에 모르겠어요를 체크하면 입력란이 비활성화 된다.",
        async () => {
          await userEvent.click($mix!);
          expect($breed).toBeDisabled();
          await userEvent.click($mix!);
          expect($breed).not.toBeDisabled();
        },
      );

      // 종 입력
      await userEvent.type($breed, "푸들");

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
        await userEvent.clear($breed);
      };

      // 모든 입력 내용 지우기
      await clearAll();

      // 아무 내용도 입력하지 않고 submit 버튼을 누른 경우
      await step(
        "아무내용도 입력하지 않고 submit 버튼을 누르면 스낵바가 뜬다.",
        async () => {
          await userEvent.click($submit);
          const snackBarCloseButton = await canvas.getByLabelText(
            "info-snackbar-close-button",
          );

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
              const snackBarCloseButton = await canvas.getByLabelText(
                "info-snackbar-close-button",
              );

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
              const snackBarCloseButton = await canvas.getByLabelText(
                "info-snackbar-close-button",
              );

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
          await userEvent.type($breed, "푸들");
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
          await userEvent.click($mix!);
          await userEvent.click($submit);

          expect(
            canvas.queryByText("필수 항목을 모두 입력해 주세요"),
          ).toBeNull();
          await userEvent.click($mix!);
        },
      );
    });

    await clearAll();

    await step("폼 데이터가 상태에 잘 저장되는지 테스트", async () => {
      await step(
        "input , textarea 에 적은 내용은 상태에 잘 저장된다.",
        async () => {
          await userEvent.type($name, "초코");
          await userEvent.type($breed, "푸들");
          await userEvent.type(
            $textarea,
            "안녕하세요 너무 귀여운 강아지 입니다.",
          );
          await userEvent.click($submit);

          const { name, breed, introduce } = usePetInfoStore.getState();

          expect(name).toBe("초코");
          expect(breed).toBe("푸들");
          expect(introduce).toBe("안녕하세요 너무 귀여운 강아지 입니다.");
        },
      );

      await step("mix 를 선택 했을 때 상태에 mix로 잘 저장된다.", async () => {
        await userEvent.click($mix!);

        const { breed } = usePetInfoStore.getState();
        expect(breed).toBe("mix");
        await userEvent.click($mix!);
      });

      await step(
        "성격란을 클릭하지 않았을 때 상태에는 아무런 값도 저장되지 않는다.",
        async () => {
          const { characterList } = usePetInfoStore.getState();
          expect(characterList).toEqual([]);
        },
      );

      await step("성격란을 클릭하면 상태엔 값이 적절히 저장된다.", async () => {
        await userEvent.click($characterButton1!);

        await expect(usePetInfoStore.getState().characterList[0]).toEqual(
          "호기심 많은",
        );

        await userEvent.click($characterButton2!);
        await expect(usePetInfoStore.getState().characterList[1]).toEqual(
          "애착이 강한",
        );

        // 이미 있는 것을 클릭 한 경우엔 폼에서 해당 값이 사라진다.
        await userEvent.click($characterButton1!);
        await expect(usePetInfoStore.getState().characterList).toEqual([
          "애착이 강한",
        ]);

        // 선택한 버튼 초기화
        await userEvent.click($characterButton2!);
      });
    });

    await clearAll();

    await step(
      "올바른 API 요청이 전송되면 role 에 값이 저장된다.",
      async () => {
        await userEvent.type($name, "초코");
        await userEvent.type($breed, "푸들");

        await userEvent.click($characterButton1!);
        await userEvent.click($characterButton2!);
        await userEvent.type(
          $textarea,
          "안녕하세요 너무 귀여운 강아지 입니다.",
        );

        await userEvent.click($submit);

        const { role } = useAuthStore.getState();
        expect(role).toBe("USER_USER");
      },
    );
  },
};

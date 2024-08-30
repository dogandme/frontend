import { Meta, StoryObj } from "@storybook/react";
import * as PetInfoForm from "./PetInfoForm";
import { http, HttpResponse } from "msw";
import { expect, userEvent, within } from "@storybook/test";
import { usePetInfoStore } from "../store";

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
      handlers: async (req, res, ctx) => {
        // request 를 가로채서 특정 url 일 때만 처리하도록 설정
        if (req.url.pathname !== "/api/pet") {
          return;
        }
        // 보낼 request의 형태 생성
        const formData = new FormData();
        formData.append("profile", new File([""], "profile.png"));
        formData.append("userid", "123");
        formData.append("name", "초코");
        formData.append(
          "personalities",
          JSON.stringify(["호기심 많은", "애착이 강한"]),
        );
        formData.append("description", "안녕하세요");

        await fetch("http://localhost:3000/pet", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
        const response = await res(
          ctx.json({
            code: 200,
            message: "success",
            content: {
              role: "USER_USER",
            },
          }),
        );
        return response;
      },
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
    return <Story />;
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
    const $name = await canvas.getByLabelText("이름이 어떻게 되나요?-input");
    const $statusText = await canvas.getAllByLabelText("status-text")[0];
    const $breed = await canvas.getByLabelText("어떤 종의 아이인가요?-input");
    const $mix = await canvasElement.querySelector("#isMixDog");
    const $characterButton1 = canvas.queryByText("호기심 많은");
    const $characterButton2 = canvas.queryByText("애착이 강한");
    const $textarea = await canvas.getByLabelText(
      "간단히 소개해 주세요-textarea",
    );
    const $submit = await canvas.getByText("등록하기");

    step("모든 컴포넌트들이 Actual DOM에 존재한다.", () => {
      expect($name).toBeInTheDocument();
      expect($breed).toBeInTheDocument();
      expect($mix).toBeInTheDocument();
      expect($characterButton1).toBeInTheDocument();
      expect($characterButton2).toBeInTheDocument();
      expect($textarea).toBeInTheDocument();
      expect($submit).toBeInTheDocument();
    });

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

    step(
      "간단히 소개해주세요 란은 최대 150자의 글을 입력 할 수 있다.",
      async () => {
        const maxIntroduce = "안녕하세요".repeat(30);
        const extraIntroduce = "나";
        await userEvent.type($textarea, maxIntroduce + extraIntroduce);
        await expect($textarea).toHaveValue(maxIntroduce);
      },
    );
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { OverlayPortal } from "@/app/OverlayPortal";
import { useAuthStore } from "@/shared/store/auth";
import { signUpByEmailHandlers } from "@/mocks/handler";
import SignUpByEmailForm from "./SignUpByEmailForm";

const meta: Meta<typeof SignUpByEmailForm> = {
  title: "features/auth/SignUpByEmailForm",
  component: SignUpByEmailForm,
  tags: ["autodocs"],
  args: {},
  argTypes: {},
  decorators: [
    (Story) => (
      <div id="root">
        <OverlayPortal />
        <div className="w-96">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SignUpByEmailForm>;

export const Default: Story = {
  decorators: (Story) => {
    useAuthStore.setState({
      token: null,
      role: null,
      nickname: null,
    });

    return <Story />;
  },

  render: () => <SignUpByEmailForm />,
};

export const Test: Story = {
  decorators: (Story) => {
    useAuthStore.setState({
      token: null,
      role: null,
      nickname: null,
    });

    return <Story />;
  },

  parameters: {
    msw: {
      handlers: signUpByEmailHandlers,
    },
  },

  render: () => <SignUpByEmailForm />,

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $emailInput = canvasElement.querySelector("#email")!;
    const $sendCodeButton = canvas.getByText("코드전송");
    const $codeInput = canvasElement.querySelector("#verification-code")!;
    const $checkCodeButton = canvas.getByText("확인");
    const $passwordInput = canvasElement.querySelector("#password")!;
    const $passwordConfirmInput =
      canvasElement.querySelector("#password-confirm")!;

    const validEmail = "hi@example.com";
    const invalidEmail = "invalid-email";
    const statusTextColor = {
      valid: "text-grey-500",
      invalid: "text-pink-500",
    };

    await step("이메일 input 형식 검사", async () => {
      await step(
        'input을 클릭하면, "이메일 형식으로 입력해 주세요" 안내 문구가 뜬다.',
        async () => {
          await userEvent.click($emailInput);

          const defaultStatusText = "이메일 형식으로 입력해 주세요";
          const $statusText = canvas.getByText(defaultStatusText);

          expect($statusText).toBeInTheDocument();
          expect($statusText).toHaveClass(statusTextColor.valid);
        },
      );

      await step("이메일 형식에 맞을 경우", async () => {
        await userEvent.type($emailInput, validEmail);

        await step("[코드전송] 버튼이 활성화된다.", async () => {
          expect($sendCodeButton).toBeEnabled();
        });

        const isValidEmailStatusText = "올바른 이메일 형식입니다";
        const $statusText = canvas.queryByText(isValidEmailStatusText);

        await step('"올바른 이메일 형식입니다" 안내 문구가 뜬다.', async () => {
          expect($statusText).toBeInTheDocument();
          expect($statusText).toHaveClass(statusTextColor.valid);
        });

        await step(
          'outfocus돼도, "올바른 이메일 형식입니다" 안내 문구는 사라지지 않는다.',
          async () => {
            await userEvent.tab();

            expect($statusText).toBeInTheDocument();
            expect($statusText).toHaveClass(statusTextColor.valid);
          },
        );
      });

      await userEvent.clear($emailInput);

      await step("이메일 형식에 맞지 않게 입력할 경우,", async () => {
        await userEvent.type($emailInput, invalidEmail);

        const errorStatusText = "이메일 형식으로 입력해 주세요";
        const $statusText = canvas.getByText(errorStatusText);

        await step("[코드전송] 버튼이 비활성화된다.", async () => {
          expect($sendCodeButton).toBeDisabled();
        });

        await step(
          '"이메일 형식으로 입력해 주세요" 경고 문구가 표시된다.',
          () => {
            expect($statusText).toHaveClass(statusTextColor.invalid);
          },
        );

        await step("outfocus돼도, 경고 문구가 사라지지 않는다.", async () => {
          await userEvent.tab();
          expect($statusText).toHaveClass(statusTextColor.invalid);
        });
      });
    });

    await userEvent.clear($emailInput);

    const $codeSendButton = canvas.getByText("코드전송");

    await step("[코드 전송] 버튼", async () => {
      await step(
        "중복되는 이메일을 입력한 상태에서 [코드전송]을 클릭하면",
        async () => {
          const duplicatedEmail = "hihihi@naver.com";

          await userEvent.type($emailInput, duplicatedEmail);
          await userEvent.click($codeSendButton);

          const $statusText =
            await canvas.findByText("이미 가입된 이메일 입니다");

          await step(
            '"이미 가입된 이메일 입니다" 에러 문구를 표시한다.',
            async () => {
              expect($statusText).toBeInTheDocument();
              expect($statusText).toHaveClass(statusTextColor.invalid);
            },
          );

          await step("버튼은 비활성화된다.", async () => {
            expect($codeSendButton).toBeDisabled();
          });

          await step("인증 코드 input은 비활성화된다.", async () => {
            expect($codeInput).toBeDisabled();
          });
        },
      );

      await userEvent.clear($emailInput);

      // todo
      // [재전송]은 기본으로 비활성화 상태로 노출되며 1분이 지나는 시점으로 활성화된다.
      // 1분 이내에 [코드전송]을 다시 누르는 경우, "1분 이후에 재전송 해주세요"라는 snackbar가 노출된다.

      await step(
        "중복되지 않는 이메일을 입력한 상태에서 [코드전송]을 클릭하면",
        async () => {
          await userEvent.type($emailInput, validEmail);
          await userEvent.click($codeSendButton);

          await step("인증 코드 input이 활성화된다.", async () => {
            expect($codeInput).toBeEnabled();
          });

          await step(
            "인증코드 인풋이 활성화 되는 시점을 기점으로 3분 타이머가 시작된다.",
            async () => {
              const $timer = await canvas.findByText(/\d\d:\d\d/);

              expect($timer).toBeInTheDocument();
            },
          );

          await step(
            "메일로 인증코드가 전송되었습니다 스낵바가 노출된다.",
            async () => {
              const $snackbar =
                await canvas.findByText("메일로 인증코드가 전송되었습니다");

              expect($snackbar).toBeInTheDocument();
            },
          );

          await step(
            "동시에 [코드전송]은 [재전송]으로 문구가 수정되어 보여진다.",
            async () => {
              expect($codeSendButton).toHaveTextContent("재전송");
            },
          );

          await step("인증 코드 input은 활성화된다.", async () => {
            expect($codeInput).toBeEnabled();
          });

          // ? 어떻게 테스트하지?
          // await step(
          //   "[재전송]은 기본으로 비활성화 상태로 노출되며 1분이 지나는 시점으로 활성화된다.",
          //   async () => {
          //     expect($codeSendButton).toBeDisabled();

          //     await waitFor(() => {
          //       expect($codeSendButton).toBeEnabled();
          //     });
          //   },
          // );
        },
      );
    });

    await step("인증 코드 검사", async () => {
      await step("숫자만 입력할 수 있다.", async () => {
        await userEvent.type($codeInput, "a123b4567");
        expect($codeInput).toHaveValue("1234567");

        await userEvent.clear($codeInput);

        await userEvent.type($codeInput, "아나진짜루1234567");
        expect($codeInput).toHaveValue("1234567");

        await userEvent.clear($codeInput);

        await userEvent.type($codeInput, "!@#12!@#$!@#34%^&*%(*&(()567");
        expect($codeInput).toHaveValue("1234567");

        await userEvent.clear($codeInput);
      });

      await userEvent.clear($codeInput);

      await step("7자리 이상 입력할 수 없다.", async () => {
        await userEvent.type($codeInput, "12345678");

        expect($codeInput).toHaveValue("1234567");
      });

      await userEvent.clear($codeInput);

      await step(
        '인증 input을 클릭하면, "인증코드 7자리를 입력해 주세요" 안내 문구를 띄운다.',
        async () => {
          await userEvent.click($codeInput);

          const $statusText =
            canvas.getByText("인증코드 7자리를 입력해 주세요");

          expect($statusText).toBeInTheDocument();
          expect($statusText).toHaveClass(statusTextColor.valid);
        },
      );

      await step(
        "만료 시간 전, 인증 코드 7자리 입력시 [확인]이 활성화 된다.",
        async () => {
          expect($checkCodeButton).toBeDisabled();

          await userEvent.type($codeInput, "1234567");
          expect($checkCodeButton).toBeEnabled();
        },
      );

      await userEvent.clear($codeInput);

      // ? 인증시간이 만료될 경우 테스트 작성 (인증 시간 만료된 경우를 어떻게 테스트하지)
      //  인증시간이 만료되었습니다 재전송 버튼을 눌러주세요 에러 문구를 띄운다.
      //  타이머도 빨간색으로 표시한다.
      //  입력값을 모두 삭제한다.
      //  [확인] 버튼이 비활성화된다.

      await step("인증 코드가 일치하지 않을 경우", async () => {
        await userEvent.type($codeInput, "7654321");
        await userEvent.click($checkCodeButton);

        await step(
          '"인증 코드를 다시 확인해 주세요" 에러 문구를 표시한다.',
          async () => {
            const $statusText =
              await canvas.findByText("인증코드를 다시 확인해 주세요");

            expect($statusText).toBeInTheDocument();
            expect($statusText).toHaveClass(statusTextColor.invalid);
          },
        );

        await step("[확인] 버튼은 비활성화된다.", async () => {
          expect($checkCodeButton).toBeDisabled();
        });
      });

      await userEvent.clear($codeInput);

      await step(
        "올바른 인증 코드를 입력하고 [확인] 버튼 클릭 시, [확인] 버튼은 비활성화 된다.",
        async () => {
          await userEvent.type($codeInput, "1111111");
          await userEvent.click($checkCodeButton);

          await new Promise((resolve) => setTimeout(resolve, 1000));

          await step("[확인] 버튼은 비활성화 된다.", async () => {
            expect($checkCodeButton).toBeDisabled();
          });

          await step('"인증되었습니다" 안내 문구를 띄운다.', async () => {
            const $statusText = await canvas.findByText("인증되었습니다");

            expect($statusText).toBeInTheDocument();
            expect($statusText).toHaveClass(statusTextColor.valid);
          });
        },
      );
    });

    const validPassword = "abcd1234!";
    const invalidPassword = "1234";

    await step("비밀번호 input 검사", async () => {
      await step(
        '값을 입력하지 않은 상태에서 focus될 경우, "비밀번호를 입력해 주세요" 안내 문구가 뜬다.',
        async () => {
          await userEvent.click($passwordInput);

          const $statusText = canvas.getByText("비밀번호를 입력해 주세요");

          expect($statusText).toBeInTheDocument();
          expect($statusText).toHaveClass(statusTextColor.valid);
        },
      );

      await step(
        "비밀번호 형식에 맞게 입력한 상태에서 outfocus한 경우, 안내 문구가 사라진다.",
        async () => {
          await userEvent.type($passwordInput, validPassword);
          await userEvent.tab();
          await userEvent.tab();

          const $statusText = canvas.queryByText("비밀번호를 입력해 주세요");

          expect($statusText).not.toBeInTheDocument();
        },
      );

      await step(
        '비밀번호 형식에 맞지 않을 경우, outfocus 여부와 상관없이 "비밀번호 형식에 맞게 입력해 주세요" 경고 문구가 뜬다.',
        async () => {
          await userEvent.clear($passwordInput);
          await userEvent.type($passwordInput, invalidPassword);

          const $statusText = await canvas.findByText(
            "비밀번호 형식에 맞게 입력해 주세요",
          );

          expect($statusText).toBeInTheDocument();
          expect($statusText).toHaveClass(statusTextColor.invalid);

          await userEvent.tab();
          await userEvent.tab();

          expect($statusText).toBeInTheDocument();
          expect($statusText).toHaveClass(statusTextColor.invalid);
        },
      );
    });

    await step("비밀번호 확인 input 검사", async () => {
      await step("비밀번호 input 값이 유효하지 않은 상태에서", async () => {
        await userEvent.clear($passwordInput);

        await step(
          '비밀번호 input 값과 입력값이 동일하지 않다면, outfocus 여부와 상관 없이 "비밀번호가 서로 일치하지 않습니다" 경고 문구가 뜬다.',
          async () => {
            await userEvent.type($passwordInput, invalidEmail);
            await userEvent.type($passwordConfirmInput, validEmail);

            const $statusText =
              await canvas.findByText("비밀번호가 서로 일치하지 않습니다");

            expect($statusText).toBeInTheDocument();
            expect($statusText).toHaveClass(statusTextColor.invalid);

            await userEvent.tab();
            await userEvent.tab();

            expect($statusText).toBeInTheDocument();
            expect($statusText).toHaveClass(statusTextColor.invalid);
          },
        );

        await userEvent.clear($passwordInput);
        await userEvent.clear($passwordConfirmInput);

        // ? status text 요소를 어떻게 찾아서 테스트할지 고민해보기
        // await step(
        //   "비밀번호 input 값과 입력값이 동일하면, 안내 문구를 표시하지 않는다.",
        //   async () => {
        //     await userEvent.type($passwordInput, invalidEmail);
        //     await userEvent.type($passwordConfirmInput, invalidEmail);
        //   },
        // );
      });

      await step("비밀번호 input 값이 유효한 상태에서", async () => {
        await userEvent.clear($passwordInput);

        await step(
          '비밀번호 input 값과 입력값이 동일하지 않다면, outfocus 여부와 상관 없이 "비밀번호가 서로 일치하지 않습니다" 경고 문구가 뜬다.',
          async () => {
            await userEvent.type($passwordInput, validPassword);
            await userEvent.type($passwordConfirmInput, invalidPassword);

            const $statusText =
              await canvas.findByText("비밀번호가 서로 일치하지 않습니다");

            expect($statusText).toBeInTheDocument();
            expect($statusText).toHaveClass(statusTextColor.invalid);

            await userEvent.tab();
            await userEvent.tab();

            expect($statusText).toBeInTheDocument();
            expect($statusText).toHaveClass(statusTextColor.invalid);
          },
        );

        await userEvent.clear($passwordInput);
        await userEvent.clear($passwordConfirmInput);

        await step(
          '비밀번호 input 값과 입력값이 동일하면, outfocus 여부와 상관 없이 "사용가능한 비밀번호 입니다" 안내 문구가 뜬다.',
          async () => {
            await userEvent.type($passwordInput, validPassword);
            await userEvent.type($passwordConfirmInput, validPassword);

            const $statusText =
              await canvas.findByText("사용가능한 비밀번호 입니다");

            expect($statusText).toBeInTheDocument();
            expect($statusText).toHaveClass(statusTextColor.valid);

            await userEvent.tab();
            await userEvent.tab();

            expect($statusText).toBeInTheDocument();
            expect($statusText).toHaveClass(statusTextColor.valid);
          },
        );
      });
    });
  },
};

export const SubmitTest: Story = {
  decorators: (Story) => {
    useAuthStore.setState({
      token: null,
      role: null,
      nickname: null,
    });

    return <Story />;
  },

  parameters: {
    msw: {
      handlers: signUpByEmailHandlers,
    },
  },

  render: () => <SignUpByEmailForm />,

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $emailInput = canvasElement.querySelector("#email")!;
    const $sendCodeButton = canvas.getByText("코드전송");
    const $codeInput = canvasElement.querySelector("#verification-code")!;
    const $checkCodeButton = canvas.getByText("확인");
    const $passwordInput = canvasElement.querySelector("#password")!;
    const $passwordConfirmInput =
      canvasElement.querySelector("#password-confirm")!;
    const $submitButton = canvas.getByText("다음");

    const validEmail = "hi@example.com";
    const validPassword = "abcd1234!";

    await step(
      '이메일을 입력하지 않은 상태에서 [다음] 버튼 클릭할 경우, "이메일과 비밀번호를 모두 입력해 주세요" 스낵바가 노출된다.',
      async () => {
        await userEvent.type($passwordInput, validPassword);
        await userEvent.type($passwordConfirmInput, validPassword);
        await userEvent.click($submitButton);

        const $snackbar = await canvas.findByText(
          "이메일과 비밀번호를 모두 입력해 주세요",
        );

        expect($snackbar).toBeInTheDocument();
      },
    );

    await userEvent.clear($passwordInput);
    await userEvent.clear($passwordConfirmInput);

    await step(
      '비밀번호를 입력하지 않은 상태에서 [다음] 버튼 클릭할 경우, "이메일과 비밀번호를 모두 입력해 주세요" 스낵바가 노출된다.',
      async () => {
        await userEvent.type($emailInput, validEmail);
        await userEvent.type($passwordConfirmInput, validPassword);
        await userEvent.click($submitButton);

        const $snackbar = await canvas.findByText(
          "이메일과 비밀번호를 모두 입력해 주세요",
        );

        expect($snackbar).toBeInTheDocument();
      },
    );

    await userEvent.clear($emailInput);
    await userEvent.clear($passwordConfirmInput);

    await step(
      '비밀번호 확인을 입력하지 않은 상태에서 [다음] 버튼 클릭할 경우, "이메일과 비밀번호를 모두 입력해 주세요" 스낵바가 노출된다.',
      async () => {
        await userEvent.type($emailInput, validEmail);
        await userEvent.type($passwordInput, validPassword);
        await userEvent.click($submitButton);

        const $snackbar = await canvas.findByText(
          "이메일과 비밀번호를 모두 입력해 주세요",
        );

        expect($snackbar).toBeInTheDocument();
      },
    );

    await userEvent.clear($emailInput);
    await userEvent.clear($passwordInput);

    await step(
      "모든 input 값이 유효한 상태에서 [다음] 버튼 클릭 시, auth store에 token과 role이 저장된다.",
      async () => {
        await userEvent.type($emailInput, validEmail);
        await userEvent.click($sendCodeButton);
        await userEvent.type($codeInput, "1111111");
        await userEvent.click($checkCodeButton);

        await userEvent.type($passwordInput, validPassword);
        await userEvent.type($passwordConfirmInput, validPassword);

        await userEvent.click($submitButton);

        await waitFor(() => {
          const { token, role } = useAuthStore.getState();

          expect(token).toBe("token");
          expect(role).toBe("ROLE_NONE");
        });
      },
    );
  },
};

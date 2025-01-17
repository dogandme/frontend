import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { OverlayPortal } from "@/app/OverlayPortal";
import { SnackbarController } from "@/shared/store";
import { useAuthStore } from "@/shared/store/auth";
import { handlers } from "@/mocks/handler";
import {
  signUpFormErrorMessage,
  signUpFormValidationMessage,
} from "../constants";
import { SignUpByEmailForm } from "./signUpByEmailForm";

const meta: Meta<typeof SignUpByEmailForm> = {
  title: "features/auth/SignUpByEmailForm",
  component: SignUpByEmailForm,
  tags: ["autodocs"],
  args: {},
  argTypes: {},
  decorators: [
    (Story) => (
      <div id="root">
        <SnackbarController>
          <OverlayPortal />
          <div className="w-96">
            <Story />
          </div>
        </SnackbarController>
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

  parameters: {
    msw: { handlers },
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
    msw: { handlers },
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
      canvasElement.querySelector("#confirm-password")!;
    const $submitButton = canvas.getByText("다음");

    const validEmail = "hi@example.com";
    const invalidEmail = "invalid-email";
    const statusTextColor = {
      valid: "text-grey-500",
      invalid: "text-pink-500",
    };

    await step("이메일 input 형식 검사", async () => {
      await step("이메일 형식에 맞을 경우", async () => {
        await userEvent.type($emailInput, validEmail);

        await step("[코드전송] 버튼이 활성화된다.", async () => {
          expect($sendCodeButton).toBeEnabled();
        });

        const $statusText = canvas.queryByText(
          signUpFormValidationMessage.email,
        );

        await step(
          `"${signUpFormValidationMessage.email}" 안내 문구가 뜬다.`,
          async () => {
            expect($statusText).toBeInTheDocument();
            expect($statusText).toHaveClass(statusTextColor.valid);
          },
        );

        await step(
          `outfocus돼도, "${signUpFormValidationMessage.email}" 안내 문구는 사라지지 않는다.`,
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

        const $statusText = canvas.getByText(
          signUpFormErrorMessage.email.pattern,
        );

        await step("[코드전송] 버튼이 비활성화된다.", async () => {
          expect($sendCodeButton).toBeDisabled();
        });

        await step(
          `"${signUpFormErrorMessage.email.pattern}" 에러 문구가 표시된다.`,
          () => {
            expect($statusText).toHaveClass(statusTextColor.invalid);
          },
        );

        await step("outfocus돼도, 에러 문구가 사라지지 않는다.", async () => {
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

          const $statusText = await canvas.findByText(
            signUpFormErrorMessage.email.validate,
          );

          await step(
            `'${signUpFormErrorMessage.email.validate}' 에러 문구를 표시한다.`,
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

      await step(
        "중복되지 않는 이메일을 입력한 상태에서 [코드전송]을 클릭하면",
        async () => {
          await userEvent.type($emailInput, validEmail);
          await userEvent.click($codeSendButton);

          // 코드 전송 시간 고려하여 0.1초 대기
          await new Promise((resolve) => setTimeout(resolve, 100));

          await step("인증 코드 input이 활성화된다.", async () => {
            expect($codeInput).toBeEnabled();
          });

          await step(
            "메일로 인증코드가 전송되었습니다 스낵바가 노출된다.",
            async () => {
              const $snackbar =
                await canvas.findByText("메일로 인증코드가 전송되었습니다");

              expect($snackbar).toBeInTheDocument();
            },
          );

          await step(
            "인증코드 인풋이 활성화 되는 시점을 기점으로 3분 타이머가 시작된다.",
            async () => {
              const $timer = await canvas.findByText(/\d\d:\d\d/);

              expect($timer).toBeInTheDocument();
            },
          );

          await step("인증 코드 input은 활성화된다.", async () => {
            expect($codeInput).toBeEnabled();
          });
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
        `인증 input을 클릭하면, "${signUpFormErrorMessage.verificationCode.required}" 안내 문구를 띄운다.`,
        async () => {
          await userEvent.click($codeInput);

          const $statusText = canvas.getByText(
            signUpFormErrorMessage.verificationCode.required,
          );

          expect($statusText).toBeInTheDocument();
          expect($statusText).toHaveClass(statusTextColor.invalid);
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

      await step("인증 코드가 일치하지 않을 경우", async () => {
        await userEvent.type($codeInput, "7654321");
        await userEvent.click($checkCodeButton);

        await step(
          `"${signUpFormErrorMessage.verificationCode.isNotMatched}" 에러 문구를 표시한다.`,
          async () => {
            const $statusText = await canvas.findByText(
              signUpFormErrorMessage.verificationCode.isNotMatched,
            );

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

          await step("이메일 input은 비활성화 된다.", async () => {
            expect($emailInput).toBeDisabled();
          });
          await step("[재전송] 버튼은 비활성화 된다.", async () => {
            expect($codeSendButton).toBeDisabled();
          });
          await step("인증 코드 input은 비활성화 된다.", async () => {
            expect($codeInput).toBeDisabled();
          });
          await step("[확인] 버튼은 비활성화 된다.", async () => {
            expect($checkCodeButton).toBeDisabled();
          });

          await step(
            `"${signUpFormValidationMessage.verificationCode}" 안내 문구를 띄운다.`,
            async () => {
              const $statusText = await canvas.findByText(
                signUpFormValidationMessage.verificationCode,
              );

              expect($statusText).toBeInTheDocument();
              expect($statusText).toHaveClass(statusTextColor.valid);
            },
          );
        },
      );
    });

    const validPassword = "abcd1234!";
    const invalidPassword = "1234";

    await step("비밀번호 input 검사", async () => {
      await step(
        "비밀번호 형식에 맞게 입력한 상태에서 outfocus한 경우, 안내 문구가 사라진다.",
        async () => {
          await userEvent.type($passwordInput, validPassword);
          await userEvent.tab();
          await userEvent.tab();

          const $statusText = canvas.queryByText(
            signUpFormErrorMessage.password.pattern,
          );

          expect($statusText).not.toBeInTheDocument();
        },
      );

      await step(
        `비밀번호 형식에 맞지 않을 경우, outfocus 여부와 상관없이 "${signUpFormErrorMessage.password.pattern}" 경고 문구가 뜬다.`,
        async () => {
          await userEvent.clear($passwordInput);
          await userEvent.type($passwordInput, invalidPassword);

          const $statusText = await canvas.findByText(
            signUpFormErrorMessage.password.pattern,
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

        await userEvent.clear($passwordInput);
        await userEvent.clear($passwordConfirmInput);
      });

      await step("비밀번호 input 값이 유효한 상태에서", async () => {
        await userEvent.clear($passwordInput);

        await userEvent.clear($passwordInput);
        await userEvent.clear($passwordConfirmInput);

        await step(
          `비밀번호 input 값과 입력값이 동일하면, outfocus 여부와 상관 없이 "${signUpFormValidationMessage.confirmPassword}" 안내 문구가 뜬다.`,
          async () => {
            await userEvent.type($passwordInput, validPassword);
            await userEvent.type($passwordConfirmInput, validPassword);

            const $statusText = await canvas.findByText(
              signUpFormValidationMessage.confirmPassword,
            );

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

    await step(
      "모든 input 값이 유효한 상태에서 [다음] 버튼 클릭 시, auth store에 token과 role이 저장된다.",
      async () => {
        await userEvent.click($submitButton);

        await waitFor(() => {
          const { token, role } = useAuthStore.getState();

          expect(token).toBe("accessToken-ROLE_NONE");
          expect(role).toBe("ROLE_NONE");
        });
      },
    );
  },
};

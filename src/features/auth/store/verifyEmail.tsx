import { createContext, useContext } from "react";
import { usePostCheckCode, usePostSendCode } from "../api";

const VerifyEmailContext = createContext<{
  sendCodeMutation: ReturnType<typeof usePostSendCode>;
  checkCodeMutation: ReturnType<typeof usePostCheckCode>;
  isModifiedEmail: (email: string) => boolean;
  isModifiedCode: (code: string) => boolean;
  isDuplicatedEmail: boolean;
  isSentCode: boolean;
  isNotMatchedCode: boolean;
  isVerified: boolean;
} | null>(null);

export const useVerifyEmailContext = () => {
  const context = useContext(VerifyEmailContext);

  if (!context) {
    throw new Error(
      "useVerifyEmailContext은 VerifyEmailProvider 내에서만 사용 가능합니다.",
    );
  }

  return context;
};

export const VerifyEmailProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sendCodeMutation = usePostSendCode();
  const checkCodeMutation = usePostCheckCode();

  const isModifiedEmail = (email: string) =>
    email !== sendCodeMutation.variables?.email;
  const isModifiedCode = (code: string) =>
    code !== checkCodeMutation.variables?.authNum;

  const isDuplicateEmail = sendCodeMutation.error?.code === 409;
  const isSentCode = sendCodeMutation.status === "success";

  const isNotMatchedCode = checkCodeMutation.error?.code === 400;
  const isVerified = checkCodeMutation.status === "success";

  return (
    <VerifyEmailContext.Provider
      value={{
        sendCodeMutation,
        checkCodeMutation,
        isModifiedEmail,
        isModifiedCode,
        isDuplicatedEmail: isDuplicateEmail,
        isSentCode,
        isNotMatchedCode,
        isVerified,
      }}
    >
      {children}
    </VerifyEmailContext.Provider>
  );
};

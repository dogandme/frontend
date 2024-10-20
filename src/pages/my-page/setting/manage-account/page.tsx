import { useQueryClient } from "@tanstack/react-query";
import { useSettingPermission } from "@/features/setting/hooks";
import { AccountCancellationModal } from "@/features/setting/ui";
import { PasswordChangeModal } from "@/features/setting/ui";
import { PasswordSetModal } from "@/features/setting/ui";
import type { MyInfo } from "@/entities/auth/api";
import { useGetMyInfo } from "@/entities/auth/api";
import { SOCIAL_TYPE } from "@/entities/auth/constants";
import { useModal } from "@/shared/lib";
import { DividerLine } from "@/shared/ui/divider";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const AccountManagementPage = () => {
  const hasPermission = useSettingPermission("NONE");

  const { data: userInfo } = useGetMyInfo();

  if (!userInfo) {
    return null;
  }

  if (!hasPermission) {
    return null;
  }

  const { email, socialType, isPasswordSet } = userInfo;

  return (
    <>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-700">계정 관리</h1>}
      />
      <section className="flex flex-col gap-4 px-4 py-4">
        <AccountEmail email={email} socialType={socialType} />
        {isPasswordSet ? <PasswordChangeButton /> : <PasswordSetButton />}
        <DividerLine axis="row" />
        <AccountCancellationButton />
      </section>
    </>
  );
};

const AccountEmail = ({
  socialType,
  email,
}: Pick<MyInfo, "socialType" | "email">) => {
  return (
    <div className="setting-item">
      <p>{SOCIAL_TYPE[socialType]} 계정</p>
      <span className="text-grey-700 body-2">{email}</span>
    </div>
  );
};

const PasswordChangeButton = () => {
  const queryClient = useQueryClient();
  const { handleOpen, onClose } = useModal(
    () => <PasswordChangeModal onClose={onClose} />,
    {
      beforeClose: () => {
        /**
         * 만약 mutation 이 진행 중이라면 모달을 닫는 행위를
         * 중지 시킵니다.
         */
        const mutationCache = queryClient.getMutationCache().find({
          mutationKey: ["putChangePassword"],
        });
        if (mutationCache?.state.status === "pending") {
          return true;
        }
      },
    },
  );

  return (
    <button className="setting-item" onClick={handleOpen}>
      <p>비밀번호 변경</p>
      <div className="flex items-center text-grey-500">
        <span className="body-2">●●●●●●●●</span>
        <ArrowRightIcon />
      </div>
    </button>
  );
};

const PasswordSetButton = () => {
  // TODO 비밀번호 설정 모달로 변경 하기
  const queryClient = useQueryClient();

  const { handleOpen, onClose } = useModal(
    () => <PasswordSetModal onClose={onClose} />,
    {
      beforeClose: () => {
        /**
         * 만약 mutation 이 진행 중이라면 모달을 닫는 행위를
         * 중지 시킵니다.
         */
        const mutationCache = queryClient.getMutationCache().find({
          mutationKey: ["putSetPassword"],
        });
        if (mutationCache?.state.status === "pending") {
          return true;
        }
      },
    },
  );

  return (
    <button className="setting-item" onClick={handleOpen}>
      <p>비밀번호 설정</p>
      <div className="flex items-center text-grey-500">
        <span className="body-2">비밀번호를 설정해 주세요</span>
        <ArrowRightIcon />
      </div>
    </button>
  );
};

const AccountCancellationButton = () => {
  const { handleOpen, onClose } = useModal(() => (
    <AccountCancellationModal onClose={onClose} />
  ));

  return (
    <button className="setting-item" onClick={handleOpen}>
      탈퇴하기
    </button>
  );
};

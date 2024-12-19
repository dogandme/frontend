import { useQueryClient } from "@tanstack/react-query";
import { AccountCancellationModal } from "@/features/setting/ui";
import { PasswordChangeModal } from "@/features/setting/ui";
import { PasswordSetModal } from "@/features/setting/ui";
import { useGetMyInfo } from "@/entities/auth/api";
import { SOCIAL_TYPE } from "@/entities/auth/constants";
import type { MyInfo } from "@/entities/auth/types/server";
import { useModal, withAuth } from "@/shared/lib";
import { DividerLine } from "@/shared/ui/divider";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { BackwardNavigationBar } from "@/shared/ui/navigationBar";

const AccountManagementPage = withAuth(() => {
  const { data: myInfo } = useGetMyInfo();

  if (!myInfo) {
    return <AccountManagementPageSkeleton />;
  }

  const { email, socialType, isPasswordSet } = myInfo;

  return (
    <>
      <BackwardNavigationBar>계정 관리</BackwardNavigationBar>
      <section className="flex flex-col gap-4 px-4 py-4">
        <AccountEmail email={email} socialType={socialType} />
        {isPasswordSet ? <PasswordChangeButton /> : <PasswordSetButton />}
        <DividerLine axis="row" />
        <AccountCancellationButton />
      </section>
    </>
  );
}, ["ROLE_GUEST", "ROLE_USER"]);

export default AccountManagementPage;

const AccountManagementPageSkeleton = () => {
  return (
    <>
      <BackwardNavigationBar>내 정보 수정</BackwardNavigationBar>
      <section className="flex flex-col gap-4 px-4 py-4">
        <div className="setting-item">
          <p className="skeleton">이메일 계정</p>
          <span className="body-2 skeleton">example123@naver.com</span>
        </div>

        <button className="setting-item">
          <p className="skeleton">비밀번호 변경</p>
          <div className="flex items-center text-grey-500">
            <span className="body-2">●●●●●●●●</span>
            <ArrowRightIcon />
          </div>
        </button>

        <DividerLine axis="row" />
        <AccountCancellationButton disabled />
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

const AccountCancellationButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  const { handleOpen, onClose } = useModal(() => (
    <AccountCancellationModal onClose={onClose} />
  ));

  return (
    <button className="setting-item" onClick={handleOpen} {...props}>
      탈퇴하기
    </button>
  );
};

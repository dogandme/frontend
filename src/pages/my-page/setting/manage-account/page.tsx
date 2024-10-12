import { usePasswordChangeModal } from "@/features/setting/hooks";
import {
  useSettingPermission,
  usePasswordSetModal,
} from "@/features/setting/hooks";
import { AccountCancellationModal } from "@/features/setting/ui";
import type { MyInfo } from "@/entities/auth/api";
import { useGetMyInfo } from "@/entities/auth/api";
import { SOCIAL_TYPE } from "@/entities/auth/constants";
import { useModal } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { DividerLine } from "@/shared/ui/divider";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const AccountManagementPage = () => {
  const hasPermission = useSettingPermission("NONE");

  const token = useAuthStore((state) => state.token);
  const { data: userInfo } = useGetMyInfo({ token });

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
  const handleOpenPasswordChangeModal = usePasswordChangeModal();

  return (
    <button className="setting-item" onClick={handleOpenPasswordChangeModal}>
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
  const handleOpenPasswordSetModal = usePasswordSetModal();

  return (
    <button className="setting-item" onClick={handleOpenPasswordSetModal}>
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

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChangePasswordModal } from "@/features/setting/lib";
import { AccountCancellationModal } from "@/features/setting/ui";
import { AccountEmail } from "@/entities/setting/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { useModal } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { DividerLine } from "@/shared/ui/divider";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const AccountManagementPage = () => {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    if (!role) {
      navigate(ROUTER_PATH.MY_PAGE);
    }
  }, [navigate, role]);

  if (!role) {
    return null;
  }

  return (
    <>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-700">계정 관리</h1>}
      />
      <section className="flex flex-col gap-4 px-4 py-4">
        <AccountEmail />
        <PasswordChangeButton />
        <DividerLine axis="row" />
        <AccountCancellationButton />
      </section>
    </>
  );
};

const PasswordChangeButton = () => {
  const handleOpenPasswordChangeModal = useChangePasswordModal();

  return (
    <button className="setting-item" onClick={handleOpenPasswordChangeModal}>
      <p>비밀번호 변경</p>
      <span className="text-grey-500">
        <ArrowRightIcon />
      </span>
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

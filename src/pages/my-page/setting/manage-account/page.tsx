import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AccountCancellationButton,
  PasswordChangeButton,
} from "@/features/setting/ui";
import { AccountEmail } from "@/entities/setting/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { DividerLine } from "@/shared/ui/divider";
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

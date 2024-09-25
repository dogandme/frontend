import {
  AccountCancellation,
  PasswordChangeButton,
} from "@/features/setting/ui/Account";
import { AccountEmail } from "@/entities/setting/ui";
import { DividerLine } from "@/shared/ui/divider";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const AccountManagementPage = () => {
  return (
    <>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-700">계정 관리</h1>}
      />
      <section className="flex flex-col gap-4 px-4 py-4">
        <AccountEmail />
        <PasswordChangeButton />
        <DividerLine axis="row" />
        <AccountCancellation />
      </section>
    </>
  );
};

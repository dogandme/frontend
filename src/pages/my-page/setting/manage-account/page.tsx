import { ChangePassword } from "@/features/setting/ui/Account";
import { AccountEmail } from "@/entities/setting/ui";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const AccountManagementPage = () => {
  return (
    <>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-700">계정 관리</h1>}
      />
      <section className="flex flex-col gap-4 px-4 py-4">
        <AccountEmail />
        <ChangePassword />
      </section>
    </>
  );
};

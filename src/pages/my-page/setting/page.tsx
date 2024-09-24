// import {
//   AccountManagement,
//   EditMyInfo,
//   MyActivity,
//   Notification,
//   TermsOfService,
//   VersionInfo,
//   Report,
//   LogoutButton,
// } from "@/entities/profile/ui";
import {
  AccountManagement,
  EditMyInfo,
  MyActivity,
  Notification,
  TermsOfService,
  Report,
  LogoutButton,
} from "@/features/setting/ui";
import { VersionInfo } from "@/entities/setting/ui";
import { DividerLine } from "@/shared/ui/divider";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const SettingPage = () => {
  return (
    <>
      <section>
        <BackwardNavigationBar
          label={<h1 className="title-1 text-grey-900">설정</h1>}
        />
        <section className="flex flex-col gap-4 px-4 py-4">
          <AccountManagement />
          <EditMyInfo />
          <DividerLine axis="row" />
          <MyActivity />
          <Notification />
          <DividerLine axis="row" />
          <TermsOfService />
          <VersionInfo />
          <Report />
          <DividerLine axis="row" />
          <LogoutButton />
        </section>
      </section>
    </>
  );
};

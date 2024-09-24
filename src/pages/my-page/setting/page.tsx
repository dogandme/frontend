import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuthStore } from "@/shared/store";
import { DividerLine } from "@/shared/ui/divider";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const SettingPage = () => {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    if (role === null) {
      navigate("/my-page");
    }
  }, [navigate, role]);

  if (role === null) {
    return null;
  }

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

import { Outlet } from "react-router-dom";
import { MainFooter } from "@/app/layout";
import { OverlayPortal } from "@/app";
import { HistoryTracker } from "@/app";

const MainLayout = () => {
  return (
    // TODO 레이아웃 범위 디자이너와 상의 후 픽스하기
    <>
      <HistoryTracker />
      <OverlayPortal />
      <main className="flex grow flex-col overflow-y-scroll">
        <Outlet />
      </main>
      <MainFooter />
    </>
  );
};

export default MainLayout;

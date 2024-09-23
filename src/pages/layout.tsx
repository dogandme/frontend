import { Outlet } from "react-router-dom";
import { OverlayPortal } from "@/app/OverlayPortal";

interface MainLayoutProps {
  MainFooter: React.ReactNode;
}

const MainLayout = ({ MainFooter }: MainLayoutProps) => {
  return (
    // TODO 레이아웃 범위 디자이너와 상의 후 픽스하기
    <>
      <OverlayPortal />
      <main className="flex grow flex-col overflow-y-scroll">
        <Outlet />
      </main>
      {MainFooter}
    </>
  );
};

export default MainLayout;

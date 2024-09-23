import { Outlet } from "react-router-dom";

interface MainLayoutProps {
  MainFooter: JSX.Element;
  OverlayPortal: JSX.Element;
  HistoryTracker: JSX.Element;
}

const MainLayout = ({
  MainFooter,
  OverlayPortal,
  HistoryTracker,
}: MainLayoutProps) => {
  return (
    // TODO 레이아웃 범위 디자이너와 상의 후 픽스하기
    <>
      {HistoryTracker}
      {OverlayPortal}
      <main className="flex grow flex-col overflow-y-scroll">
        <Outlet />
      </main>
      {MainFooter}
    </>
  );
};

export default MainLayout;

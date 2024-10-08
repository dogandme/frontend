import { Outlet } from "react-router-dom";
import { DevTools } from "./DevTools";
import { FooterNavigationBar } from "./FooterNavigationBar";
import { HistoryTracker } from "./HistoryTracker";
import { MobileLayout } from "./MobileLayout";
import { OverlayPortal } from "./OverlayPortal";
import { ReactQueryProvider } from "./ReactQueryProvider";

const GlobalLayout = () => {
  return (
    // TODO 레이아웃 범위 디자이너와 상의 후 픽스하기
    <MobileLayout>
      <ReactQueryProvider>
        {/* 
      // ! TODO
      // ! 해당 컴포넌트는 개발 환경에서만 사용 되는 컴포넌트 입니다.
      // ! main.ts 파일에서 렌더링 되며 import.meta.DEV 를 통해 개발 환경인지 확인합니다.
      // ! 배포 시엔 해당 컴포넌트가 렌더링 되지 않지만 위험을 방지하기 위해 배포 시 해당 컴포넌트를 제거 해주세요
   */}
        {import.meta.env.DEV && <DevTools />}
        <HistoryTracker />
        <OverlayPortal />
        <main className="flex grow flex-col overflow-y-scroll">
          <Outlet />
        </main>
        <FooterNavigationBar />
      </ReactQueryProvider>
    </MobileLayout>
  );
};

export default GlobalLayout;

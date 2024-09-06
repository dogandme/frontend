import { OverlayPortal } from "@/app/OverlayPortal";
import { MainFooter } from "@/widgets/footer/ui";
import { GlobalNavigationBar } from "@/widgets/navigationbar/ui";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    // TODO 레이아웃 범위 디자이너와 상의 후 픽스하기
    <>
      <OverlayPortal />
      <GlobalNavigationBar />
      <section className="flex grow flex-col overflow-y-scroll">
        <Outlet />
      </section>
      {/* 해당 부분은 바텀 시트가 나오게 되면 삭제 될 부분 */}
      <div className="rounded-t-[28px] px-4 py-4"></div>
      <MainFooter />
    </>
  );
};

export default MainLayout;

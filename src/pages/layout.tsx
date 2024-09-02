import { GlobalNavigationBar } from "@/widgets/navigationbar/ui/GlobalNavigationBar";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    // TODO 레이아웃 범위 디자이너와 상의 후 픽스하기
    <div>
      <GlobalNavigationBar />
      <Outlet />
    </div>
  );
};

export default MainLayout;

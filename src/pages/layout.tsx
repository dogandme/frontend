import { Outlet } from "react-router-dom";
import { HistoryTracker } from "@/app/HistoryTracker";
const MainLayout = () => {
  return (
    // TODO 레이아웃 범위 디자이너와 상의 후 픽스하기
    <div className="mx-auto my-0 min-h-[3.25rem] w-full min-w-80 max-w-[37.5rem]">
      <HistoryTracker />
      <Outlet />
    </div>
  );
};

export default MainLayout;

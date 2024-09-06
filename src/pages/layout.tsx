import { MainFooter } from "@/widgets/map/ui";
import { GlobalNavigationBar } from "@/widgets/navigationbar/ui";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    // TODO 레이아웃 범위 디자이너와 상의 후 픽스하기
    <>
      <GlobalNavigationBar />
      <section className="flex grow flex-col overflow-y-scroll">
        <Outlet />
      </section>
      {/* TODO 바텀시트 나오면 바텀시트로 대체하기 
        TODO 저작권 정책 아이콘 어디에 둘 지 생각해보기
      */}
      <div className="z-999 absolute bottom-[5rem] w-full rounded-t-[28px] bg-grey-0 px-4 py-4"></div>
      <MainFooter />
    </>
  );
};

export default MainLayout;

import { Outlet } from "react-router-dom";
import { SnackbarController } from "@/shared/store/snackbar";
import { GoogleMapsProvider } from "./GoogleMapsProvider";
import { HistoryTracker } from "./HistoryTracker";
import { MainLayout } from "./MainLayout";
import { OverlayPortal } from "./OverlayPortal";
import { ReactQueryProvider } from "./ReactQueryProvider";

export const AppProviderLayout = () => {
  return (
    // TODO 레이아웃 범위 디자이너와 상의 후 픽스하기
    <ReactQueryProvider>
      <GoogleMapsProvider>
        <MainLayout>
          <HistoryTracker />
          <SnackbarController>
            <OverlayPortal />
            <Outlet />
          </SnackbarController>
        </MainLayout>
      </GoogleMapsProvider>
    </ReactQueryProvider>
  );
};

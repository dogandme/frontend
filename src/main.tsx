import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ReactQueryProvider, MobileLayout, router } from "./app";
import { DevTools } from "./app/DevToolst";
import { GoogleMapsProvider } from "./app/GoogleMapsProvider";
import "./global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 
    // ! TODO
    // ! 해당 컴포넌트는 개발 환경에서만 사용 되는 컴포넌트 입니다.
    // ! main.ts 파일에서 렌더링 되며 import.meta.DEV 를 통해 개발 환경인지 확인합니다.
    // ! 배포 시엔 해당 컴포넌트가 렌더링 되지 않지만 위험을 방지하기 위해 배포 시 해당 컴포넌트를 제거 해주세요
 */}
    {import.meta.env.DEV && <DevTools />}
    <ReactQueryProvider>
      <MobileLayout>
        <GoogleMapsProvider>
          <RouterProvider router={router} />
        </GoogleMapsProvider>
      </MobileLayout>
    </ReactQueryProvider>
  </StrictMode>,
);

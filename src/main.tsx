import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app";
import { DevTools } from "./app/DevTools";
import "./global.css";
import { handlers } from "./mocks/handler";

async function enableMocking() {
  // window 객체가 존재하는 브라우저 환경에서 worker 실행
  if (typeof window !== "undefined" && import.meta.env.DEV) {
    const { setupWorker } = await import("msw/browser");

    const worker = setupWorker();
    worker.use(...handlers);

    await worker.start({ onUnhandledRequest: "bypass" });
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      {import.meta.env.DEV && <DevTools />}
      <RouterProvider router={router} />
    </StrictMode>,
  );
});

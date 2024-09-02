import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { RouterProvider } from "react-router-dom";
import { ReactQueryProvider, MobileLayout, router } from "./app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <MobileLayout>
        <RouterProvider router={router} />
      </MobileLayout>
    </ReactQueryProvider>
  </StrictMode>,
);

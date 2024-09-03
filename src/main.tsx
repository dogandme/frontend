import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { RouterProvider } from "react-router-dom";
import { ReactQueryProvider, MobileLayout, router } from "./app";
import { GoogleMapsProvider } from "./app/GoogleMapProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <MobileLayout>
        <GoogleMapsProvider>
          <RouterProvider router={router} />
        </GoogleMapsProvider>
      </MobileLayout>
    </ReactQueryProvider>
  </StrictMode>,
);

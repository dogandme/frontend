import { Outlet } from "react-router-dom";
import {
  GoogleMapsCopyRight,
  MapControlWidget,
  MapInitializer,
  MapMarkerWidget,
  GoogleMaps,
  MapBottomSheet,
} from "@/widgets/map/ui";
import { withAuth } from "@/shared/lib";

const MapLayout = withAuth(() => {
  return (
    <>
      <header className="bg-tangerine-500 px-8 py-5">
        <h1 className="title-1 text-grey-0">Mung With Me</h1>
      </header>
      <MapInitializer />
      <GoogleMaps>
        <MapMarkerWidget />
        <MapControlWidget />
        <MapBottomSheet>
          <Outlet />
        </MapBottomSheet>
        <GoogleMapsCopyRight />
      </GoogleMaps>
    </>
  );
}, ["ROLE_GUEST", "ROLE_USER", null]);

export default MapLayout;

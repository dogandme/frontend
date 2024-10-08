import { GlobalNavigationBar } from "@/app/layout";
import {
  GoogleMapsCopyRight,
  MapControlWidget,
  MapInitializer,
  MapMarkerWidget,
  GoogleMaps,
} from "@/widgets/map/ui";

export const MapPage = () => {
  return (
    <>
      <GlobalNavigationBar />
      <MapInitializer />
      <GoogleMaps>
        <MapMarkerWidget />
        <MapControlWidget />
        <GoogleMapsCopyRight />
      </GoogleMaps>
    </>
  );
};

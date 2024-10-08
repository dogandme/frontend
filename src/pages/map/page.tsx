import {
  GoogleMapsCopyRight,
  MapControlWidget,
  MapInitializer,
  MapMarkerWidget,
  GoogleMaps,
} from "@/widgets/map/ui";
import { NotificationNavigationBar } from "@/widgets/notification/ui";

export const MapPage = () => {
  return (
    <>
      <NotificationNavigationBar />
      <MapInitializer />
      <GoogleMaps>
        <MapMarkerWidget />
        <MapControlWidget />
        <GoogleMapsCopyRight />
      </GoogleMaps>
    </>
  );
};

import {
  GoogleMapsCopyRight,
  MapControlWidget,
  MapInitializer,
  MapMarkerWidget,
  GoogleMaps,
  MapBottomSheet,
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
        <MapBottomSheet />
        <GoogleMapsCopyRight />
      </GoogleMaps>
    </>
  );
};

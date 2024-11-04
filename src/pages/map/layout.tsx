import {
  GoogleMapsCopyRight,
  MapControlWidget,
  MapInitializer,
  MapMarkerWidget,
  GoogleMaps,
  MapBottomSheet,
} from "@/widgets/map/ui";
import { NotificationNavigationBar } from "@/widgets/notification/ui";

export const MapLayout = () => {
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

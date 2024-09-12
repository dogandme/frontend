import {
  GoogleMapsCopyRight,
  MapControlWidget,
  MapMarkerWidget,
} from "@/widgets/map/ui";
import { GoogleMaps } from "@/widgets/map/ui/GoogleMaps";

export const MapPage = () => {
  return (
    <GoogleMaps>
      <MapMarkerWidget />
      <MapControlWidget />
      <GoogleMapsCopyRight />
    </GoogleMaps>
  );
};

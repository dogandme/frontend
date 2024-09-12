import { GoogleMapsCopyRight, MapControlWidget } from "@/widgets/map/ui";
import { GoogleMaps } from "@/widgets/map/ui/GoogleMaps";

export const MapPage = () => {
  return (
    <GoogleMaps>
      <MapControlWidget />
      <GoogleMapsCopyRight />
    </GoogleMaps>
  );
};

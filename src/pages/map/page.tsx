import { GoogleMapsCopyRight } from "@/widgets/map/ui";
import { GoogleMaps } from "@/widgets/map/ui/GoogleMaps";
import { FloatingButton } from "@/entities/map/ui";
import { LocationIcon, MyLocationIcon, StartIcon } from "@/shared/ui/icon";

export const MapPage = () => {
  return (
    <GoogleMaps>
      <GoogleMapsCopyRight />
    </GoogleMaps>
  );
};

import {
  GoogleMapsCopyRight,
  MapControlWidget,
  MapInitializer,
  MapMarkerWidget,
} from "@/widgets/map/ui";
import { GoogleMaps } from "@/widgets/map/ui/GoogleMaps";

interface MapPageProps {
  GlobalNavigationBar: JSX.Element;
}
export const MapPage = ({ GlobalNavigationBar }: MapPageProps) => {
  return (
    <>
      {GlobalNavigationBar}
      <MapInitializer />
      <GoogleMaps>
        <MapMarkerWidget />
        <MapControlWidget />
        <GoogleMapsCopyRight />
      </GoogleMaps>
    </>
  );
};

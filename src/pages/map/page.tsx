import {
  GoogleMapsCopyRight,
  MapControlWidget,
  MapInitializer,
  MapMarkerWidget,
  GoogleMaps,
} from "@/widgets/map/ui";

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

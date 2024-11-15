import {
  GoogleMapsCopyRight,
  MapControlWidget,
  MapInitializer,
  MapMarkerWidget,
  GoogleMaps,
  MapBottomSheet,
} from "@/widgets/map/ui";

export const MapLayout = () => {
  return (
    <>
      <header className="bg-tangerine-500 px-8 py-5">
        <h1 className="title-1 text-grey-0">MUNGWITHME</h1>
      </header>
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

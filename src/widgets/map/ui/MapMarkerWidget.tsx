import { User, Pin, MultiplePin, Cluster } from "@/entities/map/ui";

export const MapMarkerWidget = () => {
  return (
    <>
      <User position={{ lat: 37.5665, lng: 126.978 }} />
      <Pin
        alt="test"
        position={{ lat: 37.56651, lng: 126.977 }}
        imageUrl="/default-image.png"
      />
      <MultiplePin
        position={{ lat: 37.5664, lng: 126.976 }}
        imageUrl="/default-image.png"
        alt="test"
        markerCount={2}
      />
      <MultiplePin
        position={{ lat: 37.5663, lng: 126.9765 }}
        imageUrl="/default-image.png"
        alt="test"
        markerCount={500}
      />
      <Cluster position={{ lat: 37.5662, lng: 126.976 }} markerCount={16} />
    </>
  );
};

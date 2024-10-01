import { AdvancedMarker } from "@vis.gl/react-google-maps";
import * as _Pin from "./pin";
import type { PinProps } from "./pin";

interface MarkerProps {
  position: {
    lat: number;
    lng: number;
  };
}

interface GooglePinProps extends MarkerProps, PinProps {}

/**
 * 해당 컴포넌트는 지도 중심에 존재하는 사용자의 위치를 표시하기 위한 컴포넌트 입니다.
 */
export const User = ({ position }: MarkerProps) => {
  return (
    <AdvancedMarker position={position}>
      <div className="relative">
        <div className="h-12 w-12 animate-radar rounded-full bg-tangerine-500 opacity-25"></div>
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-tangerine-500 opacity-100"></div>
      </div>
    </AdvancedMarker>
  );
};

export const Pin = ({ position, imageUrl, alt }: GooglePinProps) => {
  return (
    <AdvancedMarker position={position}>
      <_Pin.Default imageUrl={imageUrl} alt={alt} />
    </AdvancedMarker>
  );
};

export const MultiplePin = ({
  position,
  imageUrl,
  alt,
  markerCount,
}: GooglePinProps & { markerCount: number }) => {
  return (
    <AdvancedMarker position={position}>
      <_Pin.Multiple imageUrl={imageUrl} alt={alt} markerCount={markerCount} />
    </AdvancedMarker>
  );
};

export const Cluster = ({
  position,
  markerCount,
}: MarkerProps & { markerCount: number }) => {
  return (
    <AdvancedMarker position={position}>
      <_Pin.Cluster markerCount={markerCount} />
    </AdvancedMarker>
  );
};

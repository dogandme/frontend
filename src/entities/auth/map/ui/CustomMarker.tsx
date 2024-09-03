import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface MarkerProps {
  position: {
    lat: number;
    lng: number;
  };
}

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

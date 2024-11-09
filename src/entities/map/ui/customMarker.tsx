import { AdvancedMarker, AdvancedMarkerProps } from "@vis.gl/react-google-maps";
import { useMapStore } from "@/features/map/store";
import { API_BASE_URL } from "@/shared/constants";
import { Badge } from "@/shared/ui/badge";
import { PinShadowIcon } from "@/shared/ui/icon";
import { Cluster, Marker } from "./lib";

/**
 * 해당 컴포넌트는 지도 중심에 존재하는 사용자의 위치를 표시하기 위한 컴포넌트 입니다.
 */
export const User = ({ position }: AdvancedMarkerProps) => {
  return (
    <AdvancedMarker position={position}>
      <div className="relative">
        <div className="h-12 w-12 animate-radar rounded-full bg-tangerine-500 opacity-25"></div>
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-tangerine-500 opacity-100"></div>
      </div>
    </AdvancedMarker>
  );
};

const Pin = ({ imageUrl, alt }: AdvancedMarkerProps) => (
  <div className="relative">
    <div
      className={
        "pin relative flex h-[2.75rem] w-8 items-center justify-center bg-tangerine-500"
      }
    >
      <div className="h-[1.625rem] w-[1.625rem] translate-y-[-0.375rem] rounded-full bg-grey-0">
        <img src={imageUrl} alt={alt} className="h-full w-full rounded-2xl" />
      </div>
    </div>
    <span className="absolute translate-x-[0.25rem] translate-y-[-0.5rem]">
      <PinShadowIcon fill="tangerine-900" />
    </span>
  </div>
);

const SinglePin = ({
  position,
  imageUrl,
  alt,
  onClick,
}: AdvancedMarkerProps) => {
  return (
    <AdvancedMarker position={position} onClick={onClick}>
      <Pin imageUrl={imageUrl} alt={alt} />
    </AdvancedMarker>
  );
};

const MultiplePin = ({
  position,
  imageUrl,
  alt,
  children,
  ...props
}: AdvancedMarkerProps & {
  children: number;
}) => {
  return (
    <AdvancedMarker position={position} {...props}>
      <div className="relative">
        <Pin imageUrl={imageUrl} alt={alt} />
        <div className="absolute left-[0.75rem] top-[0.7rem]">
          <Badge colorType="secondary">{`+${Math.min(children, 99)}`}</Badge>
        </div>
      </div>
    </AdvancedMarker>
  );
};

const ClusterPin = ({ position, children, props }: AdvancedMarkerProps) => {
  return (
    <AdvancedMarker position={position} {...props}>
      <span className="btn-2 bg-translucent-tangerine flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full text-center text-tangerine-900">
        {children}
      </span>
    </AdvancedMarker>
  );
};

interface MarkingPinsProps {
  clusteredMarkers: Cluster<Marker>[];
  singleMarker: Marker[];
}

export const MarkingPins = ({
  clusteredMarkers,
  singleMarker,
}: MarkingPinsProps) => {
  const zoom = useMapStore((state) => state.mapInfo.zoom);

  return (
    <>
      {clusteredMarkers.map(
        ({ center, markerCount, previewImage, markingId, bounds }) =>
          zoom < 14 ? (
            <ClusterPin position={center} markerCount={markerCount}>
              {markerCount}
            </ClusterPin>
          ) : (
            <MultiplePin
              position={center}
              markerCount={markerCount}
              imageUrl={`${API_BASE_URL}/markings/image/preview/${markingId}/${previewImage}`}
              alt={`${markerCount}개 군집의 첫 번째 이미지`}
              bounds={bounds}
            >
              {markerCount}
            </MultiplePin>
          ),
      )}
      {singleMarker.map(({ markingId, lat, lng, previewImage }) => (
        <SinglePin
          key={markingId}
          position={{ lat, lng }}
          imageUrl={`${API_BASE_URL}/markings/image/preview/${markingId}/${previewImage}`}
          alt={`${markingId}의 이미지`}
        />
      ))}
    </>
  );
};

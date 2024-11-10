import {
  AdvancedMarker,
  AdvancedMarkerProps,
  useMap,
} from "@vis.gl/react-google-maps";
import { mapOptions } from "@/widgets/map/constants";
import { API_BASE_URL } from "@/shared/constants";
import { Badge } from "@/shared/ui/badge";
import { PinShadowIcon } from "@/shared/ui/icon";
import { Tile } from "../lib";

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
  ...props
}: AdvancedMarkerProps) => {
  return (
    <AdvancedMarker position={position} {...props}>
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

const ClusterPin = ({ position, children, ...props }: AdvancedMarkerProps) => {
  return (
    <AdvancedMarker position={position} {...props}>
      <span className="btn-2 bg-translucent-tangerine flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full text-center text-tangerine-900">
        {children}
      </span>
    </AdvancedMarker>
  );
};

interface MarkingPinProps {
  tiles: Tile[];
  clusterDensity?: number;
}
export const MarkingPins = ({
  tiles,
  clusterDensity = tiles.length / 3,
}: MarkingPinProps) => {
  const map = useMap();
  const zoom = map.getZoom();

  const handleClickSingleMarker = (position: Tile["position"]) => {
    map.setCenter(position);
    map.setZoom(mapOptions.maxZoom);
  };

  const handleClickMultipleMarker = (position: Tile["position"]) => {
    map.setCenter(position);
    map.setZoom(zoom + 1);
  };

  return tiles.map(({ markingId, markerCount, position, previewImage }) => {
    if (markerCount < 1) {
      return null;
    }

    if (markerCount === 1) {
      return (
        <SinglePin
          key={markingId}
          position={position}
          imageUrl={`${API_BASE_URL}/markings/image/preview/${markingId}/${previewImage}`}
          alt={`marking-${markingId} 마커를 나타내는 핀`}
          onClick={() => handleClickSingleMarker(position)}
        />
      );
    }

    if (markerCount < clusterDensity) {
      return (
        <MultiplePin
          key={markingId}
          position={position}
          imageUrl={`${API_BASE_URL}/markings/image/preview/${markingId}/${previewImage}`}
          alt={`${markerCount}개의 마커를 담은 멀티핀`}
          onClick={() => handleClickMultipleMarker(position)}
        >
          {markerCount}
        </MultiplePin>
      );
    }
    return (
      <ClusterPin
        key={markingId}
        position={position}
        onClick={() => handleClickMultipleMarker(position)}
        aira-label={`${markerCount}개의 마커를 포함한 클러스터`}
      >
        {markerCount}
      </ClusterPin>
    );
  });
};

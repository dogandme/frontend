import { useMapStore } from "@/features/map/store/map";
import {
  UserMarker,
  PinMarker,
  MultiplePinMarker,
  ClusterMarker,
  MarkingAddPin,
} from "@/features/map/ui";

export const MapMarkerWidget = () => {
  const mode = useMapStore((state) => state.mode);

  if (mode === "view") {
    return (
      <>
        <UserMarker />
        <PinMarker />
        <MultiplePinMarker />
        <ClusterMarker />
      </>
    );
  }
  if (mode === "add") {
    return (
      <>
        <MarkingAddPin />
      </>
    );
  }

  throw new Error(
    'MapMarkerWidget 컴포넌트는 "view" 또는 "add" 모드만 지원합니다.',
  );
};

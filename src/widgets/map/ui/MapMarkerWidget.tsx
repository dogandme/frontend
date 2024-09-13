import { useMapStore } from "@/features/map/store/map";
import {
  UserMarker,
  PinMarker,
  MultiplePinMarker,
  ClusterMarker,
  EditPin,
} from "@/features/map/ui";
import { User } from "@/entities/map/ui";

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
  if (mode === "edit") {
    return (
      <>
        <EditPin />
      </>
    );
  }

  throw new Error(
    'MapMarkerWidget 컴포넌트는 "view" 또는 "edit" 모드만 지원합니다.',
  );
};

import { useMap } from "@vis.gl/react-google-maps";
import { ResetIcon } from "@/shared/ui/icon";
import { useResearchMarkingList } from "../lib";
import { useMapStore } from "../store";

export const MarkingResearchButton = () => {
  const isLastSearchedLocation = useMapStore(
    (state) => state.isLastSearchedLocation,
  );
  const map = useMap();

  const { researchMarkingList } = useResearchMarkingList();

  if (isLastSearchedLocation) return null;

  return (
    <button
      className="flex text-tangerine-500 gap-2 pl-2 pr-3 h-8 items-center rounded-2xl bg-grey-0 shadow-custom-1"
      onClick={() => {
        researchMarkingList({
          lat: map?.getCenter().lat(),
          lng: map?.getCenter().lng(),
          zoom: map?.getZoom(),
        });
      }}
    >
      <ResetIcon width={20} height={20} />
      <span className="text-grey-500 btn-3 text-center">
        현 지도에서 재검색
      </span>
    </button>
  );
};

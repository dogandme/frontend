import { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { useLocation } from "react-router-dom";
import { useResearchMarkingList } from "@/features/map/hooks";
import { useMapStore } from "@/features/map/store";
import { MapViewModeFilter, SortTypeFilter } from "@/features/marking/ui";
import { useGetMarkingList } from "@/entities/marking/api";
import { API_BASE_URL } from "@/shared/constants";
import { MyLocationIcon } from "@/shared/ui/icon";
import { MarkingList } from "./markingList";

export const MapBottomSheet = () => {
  const location = useLocation();

  const sheetRef = useRef<SheetRef>();

  const snapPoints = [-50, 0.5, 116];
  const initialSnap = 1;

  const snapPointRef = useRef(initialSnap);
  const snapTo = (i: number) => sheetRef.current?.snapTo(i);

  const { bounds, sortType } = useResearchMarkingList();
  const { data: markingList } = useGetMarkingList({
    southWestLat: bounds?.southWest.lat,
    southWestLng: bounds?.southWest.lng,
    northEastLat: bounds?.northEast.lat,
    northEastLng: bounds?.northEast.lng,
    sortType,
  });

  const mapMode = useMapStore((state) => state.mode);

  return (
    <Sheet
      ref={sheetRef}
      isOpen={location.pathname === "/map" && mapMode === "view"}
      onClose={() => {
        const isSheetTop = snapPointRef.current === 0;

        if (isSheetTop) {
          snapTo(snapPointRef.current - 1);
          return;
        }

        snapTo(initialSnap);
      }}
      snapPoints={snapPoints}
      initialSnap={initialSnap}
      onSnap={(snapPointIndex) => (snapPointRef.current = snapPointIndex)}
      style={{ zIndex: 1 }}
      mountPoint={document.querySelector("#root")!}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content
          style={{
            padding: 0,
            paddingBottom: sheetRef.current?.y,
          }}
        >
          <Sheet.Scroller
            draggableAt="both"
            style={{
              height: "calc(100% - 5rem)",
            }}
          >
            {/* todo 버튼 활성화 여부에 따라 내용 바뀜 */}
            <h1 className="title-1 text-grey-900 p-4">동네 마킹</h1>

            <div className="flex justify-between px-4 items-center mb-4">
              <div className="flex gap-1 text-tangerine-500 items-center">
                <MyLocationIcon width={20} height={20} />
                <span className="body-2 text-grey-500">영등포 1동 주변</span>
              </div>

              <div className="flex">
                <MapViewModeFilter
                  options={["CURRENT_LOCATION", "MAP_LOCATION"]}
                />
                <SortTypeFilter
                  options={["POPULARITY", "RECENT", "DISTANCE"]}
                />
              </div>
            </div>

            <div className="px-4">
              <MarkingList display="grid">
                {markingList?.map(({ markingId, previewImage }) => (
                  <button key={markingId} type="button">
                    <img
                      className="aspect-square"
                      src={`${API_BASE_URL}/markings/image/preview/${markingId}/${previewImage}`}
                    />
                  </button>
                ))}
              </MarkingList>
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
};

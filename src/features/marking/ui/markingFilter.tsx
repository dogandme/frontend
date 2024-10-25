import { useMap } from "@vis.gl/react-google-maps";
import { mapViewModeMap, sortTypeMap } from "@/features/map/constants";
import {
  useCurrentLocation,
  useResearchMarkingList,
} from "@/features/map/hooks";
import { useMapStore } from "@/features/map/store";
import { SortType } from "@/entities/marking/api";
import { useModal } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { DropDownIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";

const MarkingFilterButton = ({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) => {
  return (
    <Button
      type="button"
      variant="text"
      colorType="tertiary"
      size="xSmall"
      fullWidth={false}
      onClick={onClick}
      style={{
        paddingRight: "0",
      }}
    >
      {children}
      <DropDownIcon />
    </Button>
  );
};

/**
 * 마킹 데이터들을 정렬하는 필터
 *
 * 옵션
 * RECENT: [최신순]
 * POPULAR: [인기순]
 * DISTANCE: [거리순]
 *
 * ! 이장소 관련 마킹에서만 [거리순] 옵션 제공하지 않습니다.
 *
 * 내 마킹: [최신순] (기본값), [인기순], [거리순] 제공
 * 동네 마킹: [인기순] (기본값), [최신순], [거리순] 제공
 * 이장소 관련 마킹: [인기순] (기본값), [최신순] 제공
 *
 * @param defaultSortType: 기본 정렬 타입
 * @param includeDistanceSortType: [거리순] 옵션 포함 여부
 */
export const SortTypeFilter = ({
  defaultSortType,
  includeDistanceSortType = true,
}: {
  defaultSortType: SortType;
  includeDistanceSortType?: boolean;
}) => {
  const { sortType, researchMarkingList } = useResearchMarkingList();

  const handleSelect = (sortType: SortType) => {
    researchMarkingList({
      sortType,
    });
  };

  if (defaultSortType === "DISTANCE" && !includeDistanceSortType) {
    throw new Error(
      "defaultSortType가 DISTANCE이면 includeDistanceSortType는 true여야 합니다.",
    );
  }

  const { handleOpen, onClose, isOpen } = useModal(() => (
    <Modal modalType="center">
      <Select isOpen={isOpen} onClose={onClose}>
        <Select.OptionList>
          <Select.Option
            value={defaultSortType}
            isSelected={defaultSortType === sortType}
            onClick={() => handleSelect(defaultSortType)}
          >
            {sortTypeMap[defaultSortType]}
          </Select.Option>

          {Object.entries(sortTypeMap)
            .filter(([key]) => includeDistanceSortType || key !== "DISTANCE")
            .filter(([key]) => key !== defaultSortType)
            .map(([key, value]) => {
              return (
                <Select.Option
                  key={key}
                  value={key}
                  onClick={() => handleSelect(key as SortType)}
                  isSelected={sortType === key}
                >
                  {value}
                </Select.Option>
              );
            })}
        </Select.OptionList>
      </Select>
    </Modal>
  ));

  return (
    <MarkingFilterButton onClick={handleOpen}>
      {sortTypeMap[sortType]}
    </MarkingFilterButton>
  );
};

type MapViewMode = keyof typeof mapViewModeMap;

// 내마킹 url
// map/nickname?sortType => 전체보기 (기본값)
// map/nickname?sortType&lat&lng&... => lat과 lng이 mapStore의 userInfo.currentLocation의 lat과 lng이 같은 경우 => 내 위치 중심
// map/nickname?sortType&lat&lng&... => lat과 lng이 mapStore의 userInfo.currentLocation의 lat과 lng이 다른 경우 => 현재 지도 중심

// 동네마킹 url
// map?sortType&lat&lng&... => lat과 lng이 mapStore의 userInfo.currentLocation의 lat과 lng이 같은 경우 => 내 위치 중심 (기본값)
// map?sortType&lat&lng&... => lat과 lng이 mapStore의 userInfo.currentLocation의 lat과 lng이 다른 경우 => 현재 지도 중심

/**
 * 내 마킹, 동네마킹에서 사용하는 필터
 * 내 마킹에서 [전체보기], [내 위치 중심], [현재 지도 중심] 옵션 제공
 * 동네 마킹에서 [내 위치 중심], [현재 지도 중심] 옵션 제공
 *
 * 옵션
 * ALL_VIEW: [전체보기]
 * CURRENT_LOCATION: [내 위치 중심]
 * MAP_LOCATION: [현재 지도 중심]
 *
 * @param includeAllViewMode: [전체보기] 옵션 포함 여부
 */
export const MapViewModeFilter = ({
  includeAllViewMode,
}: {
  includeAllViewMode: boolean;
}) => {
  const { currentLocation } = useMapStore((state) => state.userInfo);
  const setIsCenteredOnMyLocation = useMapStore(
    (state) => state.setIsCenterOnMyLocation,
  );
  const { researchMarkingList, center } = useResearchMarkingList();
  const { setCurrentLocation } = useCurrentLocation();

  const map = useMap();

  const handleSelect = (mapViewMode: MapViewMode) => {
    if (mapViewMode === "CURRENT_LOCATION") {
      setCurrentLocation({
        onSuccess: ({ coords: { latitude, longitude } }) => {
          map.setCenter({
            lat: latitude,
            lng: longitude,
          });

          setTimeout(() => {
            setIsCenteredOnMyLocation(true);
          }, 0);

          researchMarkingList();
        },
      });

      return;
    }

    if (mapViewMode === "MAP_LOCATION") {
      if (isCurrentLocation) {
        // todo 현재 지도 중심과 내 위치 중심이 같을 경우 어떻게 해야할 지 => snack bar 띄우기?
      }
      researchMarkingList();
    }

    // todo mapViewMode가 ALL_VIEW일 경우
  };

  const defaultMapViewMode: MapViewMode = includeAllViewMode
    ? "ALL_VIEW"
    : "CURRENT_LOCATION";

  let mapViewMode: MapViewMode = defaultMapViewMode;

  const isCurrentLocation =
    !!currentLocation.lat &&
    !!currentLocation.lng &&
    center.lat === currentLocation.lat &&
    center.lng === currentLocation.lng;

  if (!isCurrentLocation) mapViewMode = "MAP_LOCATION";

  const { handleOpen, onClose, isOpen } = useModal(() => (
    <Modal modalType="center">
      <Select isOpen={isOpen} onClose={onClose}>
        <Select.OptionList>
          <Select.Option
            value={defaultMapViewMode}
            onClick={() => handleSelect(defaultMapViewMode)}
            isSelected={mapViewMode === defaultMapViewMode}
          >
            {mapViewModeMap[defaultMapViewMode]}
          </Select.Option>

          {Object.keys(mapViewModeMap)
            .filter((key) => includeAllViewMode || key !== "ALL_VIEW")
            .filter((key) => key !== defaultMapViewMode)
            .map((key) => {
              return (
                <Select.Option
                  key={key}
                  value={key}
                  onClick={() => handleSelect(key as MapViewMode)}
                  isSelected={mapViewMode === key}
                >
                  {mapViewModeMap[key as MapViewMode]}
                </Select.Option>
              );
            })}
        </Select.OptionList>
      </Select>
    </Modal>
  ));

  return (
    <MarkingFilterButton onClick={handleOpen}>
      {mapViewModeMap[mapViewMode]}
    </MarkingFilterButton>
  );
};

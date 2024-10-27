import { useState } from "react";
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
 * DISTANCE: [가까운순]
 *
 * ! 이장소 관련 마킹에서만 [가까운순] 옵션 제공하지 않습니다.
 *
 * 내 마킹: [최신순] (기본값), [인기순], [가까운순] 제공
 * 동네 마킹: [인기순] (기본값), [최신순], [가까운순] 제공
 * 이장소 관련 마킹: [인기순] (기본값), [최신순] 제공
 *
 * @param options: "RECENT", "POPULAR", "DISTANCE"로 구성된 배열
 * @param defaultOptionIdx: 기본 옵션 인덱스 (기본값: 0)
 */
export const SortTypeFilter = ({
  options,
  defaultOptionIdx = 0,
}: {
  options: SortType[];
  defaultOptionIdx?: number;
}) => {
  const { sortType: selectedSortType, researchMarkingList } =
    useResearchMarkingList();

  const handleSelect = (sortType: SortType) => {
    researchMarkingList({
      sortType,
    });
  };

  const defaultOption = options[defaultOptionIdx];

  const nonDefaultOptions = options.filter(
    (option) => option !== defaultOption,
  );

  const { handleOpen, onClose, isOpen } = useModal(() => (
    <Modal modalType="center">
      <Select isOpen={isOpen} onClose={onClose}>
        <Select.OptionList>
          <Select.Option
            value={defaultOption}
            isSelected={defaultOption === selectedSortType}
            onClick={() => handleSelect(defaultOption)}
          >
            {sortTypeMap[defaultOption]}
          </Select.Option>

          {nonDefaultOptions.map((option) => {
            return (
              <Select.Option
                key={option}
                value={option}
                onClick={() => handleSelect(option)}
                isSelected={option === selectedSortType}
              >
                {sortTypeMap[option]}
              </Select.Option>
            );
          })}
        </Select.OptionList>
      </Select>
    </Modal>
  ));

  return (
    <MarkingFilterButton onClick={handleOpen}>
      {sortTypeMap[selectedSortType]}
    </MarkingFilterButton>
  );
};

type MapViewMode = keyof typeof mapViewModeMap;

/**
 * 마킹 노출 범위 필터
 *
 * 옵션
 * ALL_VIEW: [전체보기]
 * CURRENT_LOCATION: [내 위치 중심]
 * MAP_LOCATION: [현재 지도 중심]
 *
 * ! [전체보기] 옵션은 내 마킹에서만 제공합니다.
 *
 * 내 마킹: [전체보기] (기본값), [내 위치 중심], [현재 지도 중심]
 * 동네 마킹: [내 위치 중심] (기본값), [현재 지도 중심]
 *
 * @param options: "ALL_VIEW", "CURRENT_LOCATION", "MAP_LOCATION"로 구성된 배열
 * @param defaultOptionIdx: 기본 옵션 인덱스 (기본값: 0)
 */
export const MapViewModeFilter = ({
  options,
  defaultOptionIdx = 0,
}: {
  options: MapViewMode[];
  defaultOptionIdx?: number;
}) => {
  const setIsCenteredOnMyLocation = useMapStore(
    (state) => state.setIsCenterOnMyLocation,
  );
  const { researchMarkingList } = useResearchMarkingList();
  const { setCurrentLocation } = useCurrentLocation();

  const map = useMap();

  const [selectedOption, setSelectedOption] = useState<MapViewMode>(
    options[defaultOptionIdx],
  );

  const handleSelect = (mapViewMode: MapViewMode) => {
    setSelectedOption(mapViewMode);

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
      researchMarkingList();
      return;
    }

    // todo mapViewMode가 ALL_VIEW일 경우
  };

  const defaultOption = options[defaultOptionIdx];
  const nonDefaultOptions = options.filter(
    (option) => option !== defaultOption,
  );

  const { handleOpen, onClose, isOpen } = useModal(() => (
    <Modal modalType="center">
      <Select isOpen={isOpen} onClose={onClose}>
        <Select.OptionList>
          <Select.Option
            value={defaultOption}
            onClick={() => handleSelect(defaultOption)}
            isSelected={selectedOption === defaultOption}
          >
            {mapViewModeMap[defaultOption]}
          </Select.Option>

          {nonDefaultOptions.map((option) => {
            return (
              <Select.Option
                key={option}
                value={option}
                onClick={() => handleSelect(option)}
                isSelected={selectedOption === option}
              >
                {mapViewModeMap[option]}
              </Select.Option>
            );
          })}
        </Select.OptionList>
      </Select>
    </Modal>
  ));

  return (
    <MarkingFilterButton onClick={handleOpen}>
      {mapViewModeMap[selectedOption]}
    </MarkingFilterButton>
  );
};

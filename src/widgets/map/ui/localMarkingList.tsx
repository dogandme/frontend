import { useNavigate } from "react-router-dom";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapQueryParams, usePlaceQueryParams } from "@/features/map/hooks";
import { RangeFilter, SortTypeFilter } from "@/features/marking/ui";
import {
  useGetAddressFromLatLng,
  useGetMarkingList,
} from "@/entities/marking/api";
import { API_BASE_URL, ROUTER_PATH } from "@/shared/constants";
import { useInfiniteScroll } from "@/shared/lib";
import { MyLocationIcon } from "@/shared/ui/icon";
import { mapOptions } from "../constants";
import { MarkingList } from "./markingList";

export const LocalMarkingListBottomSheet = () => {
  return (
    <div className="px-4">
      {/* todo 버튼 활성화 여부에 따라 내용 바뀜 */}
      <h1 className="title-1 text-grey-900 py-4">동네 마킹</h1>
      <div className="flex justify-between items-center mb-4">
        <LocalMarkingListBottomSheetHeader />
        <LocationMarkingListFilter />
      </div>
      <LocalMarkingList />
    </div>
  );
};

const LocalMarkingList = () => {
  const navigate = useNavigate();
  const map = useMap();
  const { boundsParams, sortTypeParam, setMapQueryParams } =
    useMapQueryParams();
  const { setPlaceQueryParams } = usePlaceQueryParams();

  const {
    data: markingList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMarkingList({
    ...boundsParams,
    sortType: sortTypeParam,
    searchType: "NEARBY",
  });

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  return (
    <>
      <MarkingList display="grid">
        {markingList?.map(({ markingId, previewImage, lat, lng }) => (
          <button
            key={markingId}
            type="button"
            className="aspect-square"
            onClick={() => {
              navigate(ROUTER_PATH.PLACE);
              map.setCenter({ lat, lng });
              map.setZoom(mapOptions.maxZoom);
              setPlaceQueryParams({ lat, lng });
              setMapQueryParams({
                bounds: boundsParams,
                sortType: "POPULARITY",
              });
            }}
          >
            <img
              className="w-full h-full object-cover"
              src={`${API_BASE_URL}/markings/image/preview/${markingId}/${previewImage}`}
            />
          </button>
        ))}
      </MarkingList>
      <div className="h-[.125rem]" ref={setNode} />
    </>
  );
};

const LocalMarkingListBottomSheetHeader = () => {
  const { boundsParams } = useMapQueryParams();

  const { northEastLat, northEastLng, southWestLat, southWestLng } =
    boundsParams;

  const lat =
    typeof northEastLat === "number" && typeof southWestLat === "number"
      ? (northEastLat + southWestLat) / 2
      : null;
  const lng =
    typeof northEastLng === "number" && typeof southWestLng === "number"
      ? (northEastLng + southWestLng) / 2
      : null;

  const { data } = useGetAddressFromLatLng({
    lat,
    lng,
  });

  return (
    <div className="flex gap-1 text-tangerine-500 items-center">
      <MyLocationIcon width={20} height={20} />
      <span className="body-2 text-grey-500">{data?.region}</span>
    </div>
  );
};

const LocationMarkingListFilter = () => {
  const { sortTypeParam, setMapQueryParams } = useMapQueryParams();

  return (
    <div className="flex">
      <RangeFilter options={["CURRENT_LOCATION", "MAP_LOCATION"]} />
      <SortTypeFilter
        options={["POPULARITY", "RECENT", "DISTANCE"]}
        selectedOption={sortTypeParam || "POPULARITY"}
        onSelect={(sortType) => {
          setMapQueryParams({ sortType });
        }}
      />
    </div>
  );
};

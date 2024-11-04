import { useNavigate } from "react-router-dom";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapQueryParams } from "@/features/map/hooks";
import { useMapStore } from "@/features/map/store";
import { RangeFilter, SortTypeFilter } from "@/features/marking/ui";
import {
  useGetAddressFromLatLng,
  useGetMarkingList,
} from "@/entities/marking/api";
import { API_BASE_URL, ROUTER_PATH } from "@/shared/constants";
import { useInfiniteScroll } from "@/shared/lib";
import { MyLocationIcon } from "@/shared/ui/icon";
import { MarkingList } from "./markingList";

export const LocalMarkingList = () => {
  const navigate = useNavigate();
  const { boundsParams, sortTypeParam, setMapQueryParams } =
    useMapQueryParams();
  const {
    data: markingList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMarkingList({
    ...boundsParams,
    sortType: sortTypeParam,
  });

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const map = useMap();
  const center = map.getCenter();

  const lat = center.lat();
  const lng = center.lng();

  const { data } = useGetAddressFromLatLng({
    lat,
    lng,
  });

  return (
    <div className="px-4">
      {/* todo 버튼 활성화 여부에 따라 내용 바뀜 */}
      <h1 className="title-1 text-grey-900 py-4">동네 마킹</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1 text-tangerine-500 items-center">
          <MyLocationIcon width={20} height={20} />
          <span className="body-2 text-grey-500">{data?.region}</span>
        </div>

        <div className="flex">
          <RangeFilter options={["CURRENT_LOCATION", "MAP_LOCATION"]} />
          <SortTypeFilter options={["POPULARITY", "RECENT", "DISTANCE"]} />
        </div>
      </div>
      <MarkingList display="grid">
        {markingList?.map(({ markingId, previewImage, lat, lng }) => (
          <button
            key={markingId}
            type="button"
            className="aspect-square"
            onClick={() => {
              // todo 클러스터링 데이터에 있는 bounds로 인수 전달
              navigate(ROUTER_PATH.PLACE);
              setMapQueryParams({
                bounds: {
                  southWestLat: lat - 0.00001,
                  southWestLng: lng - 0.00001,
                  northEastLat: lat + 0.00001,
                  northEastLng: lng + 0.00001,
                },
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
    </div>
  );
};

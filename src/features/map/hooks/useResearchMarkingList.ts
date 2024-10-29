import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useMap } from "@vis.gl/react-google-maps";
import { SortType } from "@/entities/marking/api";
import { ROUTER_PATH } from "@/shared/constants";
import { sortTypeMap } from "../constants";
import { useMapStore } from "../store";

interface Filter {
  sortType?: SortType;
}

export const useResearchMarkingList = () => {
  const queryClient = useQueryClient();
  const map = useMap();

  const setIsLastSearchedLocation = useMapStore(
    (state) => state.setIsLastSearchedLocation,
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const sortTypeParam = searchParams.get("sortType");
  const sortType: SortType =
    typeof sortTypeParam === "string" && sortTypeParam in sortTypeMap
      ? (sortTypeParam as SortType)
      : "POPULARITY";

  const researchMarkingList = (filter?: Filter) => {
    if (!map) return;

    const bounds = map.getBounds();

    if (!bounds) return;

    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    const northEastLat = northEast.lat();
    const northEastLng = northEast.lng();
    const southWestLat = southWest.lat();
    const southWestLng = southWest.lng();

    setSearchParams({
      boundsNELat: northEastLat.toString(),
      boundsNELng: northEastLng.toString(),
      boundsSWLat: southWestLat.toString(),
      boundsSWLng: southWestLng.toString(),
      sortType: filter?.sortType || sortType,
    });

    setTimeout(() => {
      setIsLastSearchedLocation(true);
    }, 0);

    queryClient.removeQueries({
      queryKey: ["markingList"],
    });
  };

  const northEastLat =
    typeof searchParams.get("boundsNELat") === "string"
      ? Number(searchParams.get("boundsNELat"))
      : null;
  const northEastLng =
    typeof searchParams.get("boundsNELng") === "string"
      ? Number(searchParams.get("boundsNELng"))
      : null;
  const southWestLat =
    typeof searchParams.get("boundsSWLat") === "string"
      ? Number(searchParams.get("boundsSWLat"))
      : null;
  const southWestLng =
    typeof searchParams.get("boundsSWLng") === "string"
      ? Number(searchParams.get("boundsSWLng"))
      : null;

  const navigate = useNavigate();

  const hasBoundsParams =
    northEastLat && northEastLng && southWestLat && southWestLng;

  const navigatePlace = ({ lat, lng }: { lat: number; lng: number }) => {
    map.setCenter({ lat, lng });
    map.setZoom(19);

    const bounds = map.getBounds();

    if (!bounds) return;

    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    const northEastLat = northEast.lat();
    const northEastLng = northEast.lng();
    const southWestLat = southWest.lat();
    const southWestLng = southWest.lng();

    navigate(ROUTER_PATH.PLACE);
    setSearchParams({
      boundsNELat: northEastLat.toString(),
      boundsNELng: northEastLng.toString(),
      boundsSWLat: southWestLat.toString(),
      boundsSWLng: southWestLng.toString(),
      sortType: "RECENT",
    });
  };

  const bounds = hasBoundsParams
    ? {
        northEast: { lat: northEastLat, lng: northEastLng },
        southWest: { lat: southWestLat, lng: southWestLng },
      }
    : null;

  return {
    bounds,
    sortType,
    researchMarkingList,
    navigatePlace,
  };
};

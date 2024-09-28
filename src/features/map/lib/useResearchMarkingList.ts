import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapStore } from "../store";

export const useResearchMarkingList = () => {
  const queryClient = useQueryClient();
  const map = useMap();

  const setIsLastSearchedLocation = useMapStore(
    (state) => state.setIsLastSearchedLocation,
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const researchMarkingList = ({
    lat,
    lng,
    zoom,
  }: {
    lat: number;
    lng: number;
    zoom: number;
  }) => {
    if (!map) return;

    setSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      zoom: zoom.toString(),
    });

    setTimeout(() => {
      setIsLastSearchedLocation(true);
    }, 0);

    queryClient.removeQueries({
      queryKey: ["markingList"],
    });
    queryClient.invalidateQueries({
      queryKey: ["markingList"],
    });
  };

  const lastSearchedBounds = map?.getBounds();
  const northEast = lastSearchedBounds?.getNorthEast();
  const southWest = lastSearchedBounds?.getSouthWest();
  const southBottomLat = southWest?.lat();
  const northTopLat = northEast?.lat();
  const southLeftLng = southWest?.lng();
  const northRightLng = northEast?.lng();

  const hasAllParams =
    searchParams.has("lat") &&
    searchParams.has("lng") &&
    searchParams.has("zoom");

  return {
    hasAllParams,
    researchMarkingList,
    lastSearchedBounds: {
      southBottomLat,
      northTopLat,
      southLeftLng,
      northRightLng,
    },
  };
};

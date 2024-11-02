// 맵에 보여줄 마커를 반환하는 훅
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/shared/store";
import { useGetBoundaryMarkerList } from "../api";
import { useGetMyMakerList } from "../api/getMyMakerList";

export const useGetMarkerList = (boundsParams: {
  southWestLat: number | null;
  southWestLng: number | null;
  northEastLat: number | null;
  northEastLng: number | null;
}) => {
  const { nickname } = useParams<{ nickname: string }>();

  const boundaryMarkerListResult = useGetBoundaryMarkerList({
    ...boundsParams,
    enabled: !nickname,
  });

  const nicknameParams = nickname ? decodeURI(nickname.slice(1)) : null;
  const isMyPage = nicknameParams === useAuthStore.getState().nickname;

  const myMarkerListResult = useGetMyMakerList();

  if (isMyPage) return myMarkerListResult;

  return boundaryMarkerListResult;
};

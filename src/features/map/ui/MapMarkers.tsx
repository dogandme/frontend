import { User, Pin, MultiplePin, Cluster } from "@/entities/map/ui";
import { useMapStore } from "../store";

/*---------- default mode 일 때에만 사용되는 마커입니다. ---------- */

export const UserMarker = () => {
  const { currentLocation, hasLocationPermission } = useMapStore(
    (state) => state.userInfo,
  );
  const { lat, lng } = currentLocation;

  if (!hasLocationPermission || lat === null || lng === null) return null;

  return <User position={{ lat, lng }} />;
};

export const PinMarker = () => {
  // TODO API 요청으로 가져오기
  const markersInfo = [
    {
      alt: "test",
      position: { lat: 37.56651, lng: 126.977 },
      imageUrl: "/public/default-image.png",
    },
    {
      alt: "test",
      position: { lat: 37.56652, lng: 126.975 },
      imageUrl: "/public/default-image.png",
    },
    {
      alt: "test",
      position: { lat: 37.56653, lng: 126.973 },
      imageUrl: "/public/default-image.png",
    },
  ];

  return markersInfo.map((markerInfo, idx) => (
    <Pin {...markerInfo} key={idx} />
  ));
};

export const MultiplePinMarker = () => {
  // TODO API 요청으로 가져오기 ? 혹은 가져온 markersInfo를 이용하여 클러스터링 하기
  const multiMarkerInfo = [
    {
      position: { lat: 37.5664, lng: 126.974 },
      imageUrl: "/public/default-image.png",
      alt: "test",
      markerCount: 2,
    },
    {
      position: { lat: 37.5663, lng: 126.972 },
      imageUrl: "/public/default-image.png",
      alt: "test",
      markerCount: 500,
    },
  ];

  return multiMarkerInfo.map((markerInfo, idx) => (
    <MultiplePin {...markerInfo} key={idx} />
  ));
};

export const ClusterMarker = () => {
  // TODO API 요청으로 가져오기 ? 혹은 가져온 markersInfo를 이용하여 클러스터링 하기
  const clusterInfo = [
    {
      position: { lat: 37.5662, lng: 126.97 },
      markerCount: 16,
    },
    {
      position: { lat: 37.5661, lng: 126.968 },
      markerCount: 32,
    },
  ];

  return clusterInfo.map((cluster, idx) => <Cluster {...cluster} key={idx} />);
};

/* 해당 컴포넌트는 add mode 일 때 사용되는 마커입니다. AdvancedMarker 를 이용하지 않습니다.*/

export const MarkingAddPin = () => {
  // TODO UserInfo API 나오면 유저 프로필 사진 붙이기
  const profileImage = "/public/default-image.png";
  const alt = "test";

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[5.65rem]">
      <div className="pin flex h-[2.75rem] w-8 items-center justify-center bg-tangerine-500 scale-[2]">
        <div className="h-[1.625rem] w-[1.625rem] translate-y-[-0.375rem] rounded-full bg-grey-0">
          <img
            src={profileImage}
            alt={alt}
            className="h-full w-full rounded-2xl"
          />
        </div>
      </div>
      <div className="absolute -translate-x-[0.5rem] z-[999]">
        <div className="h-12 w-12 animate-radar rounded-full bg-tangerine-500 opacity-25"></div>
      </div>
    </div>
  );
};

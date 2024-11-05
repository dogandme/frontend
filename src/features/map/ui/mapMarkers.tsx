import { User } from "@/entities/map/ui";
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

/* 해당 컴포넌트는 add mode 일 때 사용되는 마커입니다. AdvancedMarker 를 이용하지 않습니다.*/

export const MarkingAddPin = () => {
  // TODO UserInfo API 나오면 유저 프로필 사진 붙이기
  const profileImage = "/default-image.png";
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

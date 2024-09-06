import { GoogleMapsCopyRight } from "@/widgets/map/ui";
import { GoogleMaps, MarkingButton } from "@/features/map/ui";
import { FloatingButton } from "@/entities/map/ui";
import { LocationIcon, MyLocationIcon, StartIcon } from "@/shared/ui/icon";
export const MapPage = () => {
  return (
    <div className="relative h-full">
      <GoogleMaps />
      <div className="absolute bottom-[60px] flex w-full flex-col gap-2 px-4">
        {/* TODO 버튼들 기능 붙혀서 리팩토링 하기 */}
        <div className="flex justify-between">
          <div className="flex items-end">
            <FloatingButton>
              <MyLocationIcon />
            </FloatingButton>
          </div>
          <div className="flex flex-col gap-2">
            <FloatingButton imgSrc="http://localhost:5173/default-profile.svg" />
            <FloatingButton>
              <LocationIcon />
            </FloatingButton>
            <FloatingButton>
              <StartIcon />
            </FloatingButton>
          </div>
        </div>
        <MarkingButton />
        <GoogleMapsCopyRight />
      </div>
    </div>
  );
};

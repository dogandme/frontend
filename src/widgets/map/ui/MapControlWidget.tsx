import { MarkingButton } from "@/features/map/ui";
import { FloatingButton } from "@/entities/map/ui";
import { LocationIcon, MyLocationIcon, StartIcon } from "@/shared/ui/icon";

/**
 * MapControlWidget 컴포넌트는 사용자가 사용중인 모드에 따라 서로 다른 컨트롤 버튼들을 렌더링 해야 합니다.
 */
export const MapControlWidget = () => {
  return (
    <>
      {/* Map 최하단에 렌더링 될 컨트롤 버튼들 */}
      <div className="absolute bottom-[6.875rem] left-4">
        <FloatingButton>
          <LocationIcon />
        </FloatingButton>
      </div>
      <div className="flex flex-col gap-2 absolute bottom-[6.875rem] right-4">
        <FloatingButton>
          <MyLocationIcon />
        </FloatingButton>
        <FloatingButton>
          <LocationIcon />
        </FloatingButton>
        <FloatingButton>
          <StartIcon />
        </FloatingButton>
      </div>
      <div className="absolute w-full px-4 bottom-[3.375rem]">
        <MarkingButton />
      </div>
    </>
  );
};

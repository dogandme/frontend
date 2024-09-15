import { useMapStore } from "@/features/map/store/map";
import {
  MarkingEditButton,
  MarkingFormTriggerButton,
  MyLocationButton,
  ShowOthersMarkingButton,
  CollectionButton,
  ExitEditModeButton,
} from "@/features/map/ui";

/**
 * MapControlWidget 컴포넌트는 사용자가 사용중인 모드에 따라 서로 다른 컨트롤 버튼들을 렌더링 해야 합니다.
 */
export const MapControlWidget = () => {
  const mode = useMapStore((state) => state.mode);

  if (mode === "view") {
    return (
      <>
        {/* Map 최하단에 렌더링 될 컨트롤 버튼들 */}
        <div className="absolute bottom-[6.875rem] left-4">
          <MyLocationButton />
        </div>
        <div className="flex flex-col gap-2 absolute bottom-[6.875rem] right-4">
          {/* TODO UserInfo API 나오면 유저 프로필 사진 붙이기 */}
          <MyLocationButton />
          <ShowOthersMarkingButton />
          <CollectionButton />
        </div>
        {/* 마킹하기 버튼 */}
        <div className="absolute w-full px-4 bottom-[3.375rem]">
          <MarkingEditButton />
        </div>
      </>
    );
  }

  if (mode === "edit") {
    return (
      <>
        <div className="absolute top-4 right-4">
          <ExitEditModeButton />
        </div>
        <div className="absolute w-full px-4 bottom-[3.375rem]">
          <MarkingFormTriggerButton />
        </div>
      </>
    );
  }

  throw new Error(
    'MapControlWidget 컴포넌트는 "view" 또는 "edit" 모드만 지원합니다.',
  );
};

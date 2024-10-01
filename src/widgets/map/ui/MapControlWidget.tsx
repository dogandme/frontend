import { useMapStore } from "@/features/map/store/map";
import {
  MarkingAddButton,
  MarkingFormTriggerButton,
  MyLocationButton,
  CollectionButton,
  ExitAddModeButton,
  MarkingResearchButton,
  ShowMyMarkingButton,
  ShowAroundMarkingButton,
} from "@/features/map/ui";
import { DividerLine } from "@/shared/ui/divider";

/**
 * MapControlWidget 컴포넌트는 사용자가 사용중인 모드에 따라 서로 다른 컨트롤 버튼들을 렌더링 해야 합니다.
 */
export const MapControlWidget = () => {
  const mode = useMapStore((state) => state.mode);

  if (mode === "view") {
    return (
      <>
        {/* Map 최하단에 렌더링 될 컨트롤 버튼들 */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <MarkingResearchButton />
        </div>
        <div className="absolute bottom-[6.875rem] left-4">
          <MyLocationButton />
        </div>
        <div className="flex flex-col absolute bottom-[6.875rem] right-4 rounded-2xl shadow-custom-1">
          <ShowMyMarkingButton />
          <DividerLine axis="row" />
          <ShowAroundMarkingButton />
        </div>
        <div className="absolute top-4 left-4">
          <CollectionButton />
        </div>
        {/* 마킹하기 버튼 */}
        <div className="absolute w-full px-4 bottom-[3.375rem]">
          <MarkingAddButton />
        </div>
      </>
    );
  }

  if (mode === "add") {
    return (
      <>
        <div className="absolute top-4 right-4">
          <ExitAddModeButton />
        </div>
        <div className="absolute w-full px-4 bottom-[3.375rem]">
          <MarkingFormTriggerButton />
        </div>
      </>
    );
  }

  throw new Error(
    'MapControlWidget 컴포넌트는 "view" 또는 "add" 모드만 지원합니다.',
  );
};

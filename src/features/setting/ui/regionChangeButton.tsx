import type { Region } from "@/entities/map/types/server";
import { ActionChip } from "@/shared/ui/chip";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { useChangeRegionModal } from "../lib";

interface RegionChangeButtonProps {
  regions: Region[];
}
export const RegionChangeButton = ({ regions }: RegionChangeButtonProps) => {
  const handleOpen = useChangeRegionModal(regions);

  return (
    <div>
      <button className="w-full" onClick={handleOpen}>
        <div className="setting-item">
          <span>동네설정</span>
          <div className="text-grey-500">
            <ArrowRightIcon />
          </div>
        </div>
      </button>
      <ul className="flex items-start gap-2 self-stretch overflow-auto pb-4">
        {regions.map(({ id, province, cityCounty, subDistrict }) => (
          <li key={id} className="flex flex-shrink-0">
            <ActionChip
              variant="outlined"
              isSelected={true}
              onClick={handleOpen}
            >
              {`${province} ${cityCounty} ${subDistrict}`}
            </ActionChip>
          </li>
        ))}
      </ul>
    </div>
  );
};

import type { Region } from "@/features/auth/api/region";
import { ActionChip } from "@/shared/ui/chip";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { useChangeRegionModal } from "../hooks";

export const RegionChangeButton = ({ regions }: { regions: Region[] }) => {
  const handleOpen = useChangeRegionModal(regions);

  return (
    <button onClick={handleOpen}>
      <div className="setting-item">
        <span>동네설정</span>
        <div className="text-grey-500">
          <ArrowRightIcon />
        </div>
      </div>
      <ul className="flex items-start gap-2 self-stretch overflow-auto pb-4">
        {regions.map(({ id, province, cityCounty, subDistrict }) => (
          <li key={id} className="flex flex-shrink-0">
            <ActionChip variant="outlined" isSelected={true}>
              {`${province} ${cityCounty} ${subDistrict}`}
            </ActionChip>
          </li>
        ))}
      </ul>
    </button>
  );
};

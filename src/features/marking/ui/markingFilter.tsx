import { sortTypeMap } from "@/features/map/constants";
import { useResearchMarkingList } from "@/features/map/hooks";
import { SortType } from "@/entities/marking/api";
import { useModal } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { DropDownIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";

const MarkingFilterButton = ({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) => {
  return (
    <Button
      type="button"
      variant="text"
      colorType="tertiary"
      size="xSmall"
      fullWidth={false}
      onClick={onClick}
      style={{
        paddingRight: "0",
      }}
    >
      {children}
      <DropDownIcon />
    </Button>
  );
};

export const SortTypeFilter = () => {
  const { sortType, researchMarkingList } = useResearchMarkingList();

  const handleSelect = (sortType: SortType) => {
    researchMarkingList({
      sortType,
    });
  };

  const { handleOpen, onClose, isOpen } = useModal(() => (
    <Modal modalType="center">
      <Select isOpen={isOpen} onClose={onClose}>
        <Select.OptionList>
          {Object.entries(sortTypeMap).map(([key, value]) => {
            return (
              <Select.Option
                key={key}
                value={key}
                onClick={() => handleSelect(key as SortType)}
                isSelected={sortType === key}
              >
                {value}
              </Select.Option>
            );
          })}
        </Select.OptionList>
      </Select>
    </Modal>
  ));

  return (
    <MarkingFilterButton onClick={handleOpen}>
      {sortTypeMap[sortType]}
    </MarkingFilterButton>
  );
};

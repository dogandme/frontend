import { Button } from "@/shared/ui/button";
import { ActionChip } from "@/shared/ui/chip";
import { CloseIcon, MapLocationSearchingIcon } from "@/shared/ui/icon";
import { SearchIcon } from "@/shared/ui/icon";
import { Input } from "@/shared/ui/input";
import { List } from "@/shared/ui/list";
import { Modal } from "@/shared/ui/modal";
import { CloseNavigationBar } from "@/shared/ui/navigationbar";

export const RegionModal = ({ onClose }: { onClose: () => Promise<void> }) => {
  // TODO API 요청으로 받아오기
  const regionList = [
    "영등포 1동",
    "영등포 2동",
    "영등포 3동",
    "영등포 4동",
    "영등포 5동",
    "영등포 6동",
    "영등포 7동",
  ];

  return (
    <Modal modalType="fullPage">
      {/* Header */}
      <CloseNavigationBar onClick={onClose} />
      <section className="px-4 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          {/* 검색창 */}
          <Input
            id="region-search"
            componentType="searchText"
            leadingNode={<SearchIcon />}
            placeholder="동명(읍,면)으로 검색"
          />
          {/* 현재 위치로 찾기 버튼 */}
          <Button
            type="button"
            variant="outlined"
            colorType="tertiary"
            size="medium"
          >
            <MapLocationSearchingIcon />
            <span>현재 위치로 찾기</span>
          </Button>
        </div>
        {/* 검색 리스트 */}
        <section className="flex flex-col gap-4 min-h-24">
          {regionList.length > 0 && (
            <>
              <h1 className="title-2 text-grey-900">검색 결과</h1>
              <List
                style={{
                  height: "18rem",
                  overflowY: "auto",
                  justifyContent: "start",
                }}
              >
                {regionList.map((region, idx) => (
                  <List.Item
                    key={idx}
                    style={{ justifyContent: "start" }}
                    additionalClassName="title-3"
                  >
                    {region}
                  </List.Item>
                ))}
              </List>
            </>
          )}
        </section>
        {/* 검색 결과 리스트 */}
        <section className="py-2 flex flex-col gap-4">
          <p className="title-2">선택된 동네</p>
          <ul className="flex items-start gap-2 self-stretch overflow-auto">
            {[
              "영등포동 5가",
              "영등포동 6가",
              "영등포동 7가",
              "영등포동 8가",
            ].map((selectedRegion, idx) => (
              <li className="flex flex-shrink-0">
                <ActionChip
                  variant="outlined"
                  label={selectedRegion}
                  trailingIcon={<CloseIcon />}
                  key={idx}
                />
              </li>
            ))}
          </ul>
        </section>
        {/* 확인 버튼 */}
        <Button colorType="primary" variant="filled" size="medium">
          확인
        </Button>
      </section>
    </Modal>
  );
};

import { useRef, useState } from "react";
import { SelectOpener } from "@/entities/auth/ui";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { CloseIcon, MyLocationIcon, PlusIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { TextArea } from "@/shared/ui/textarea";
import { useMarkingFormStore } from "../store/form";

interface MarkingFormModalProps {
  onClose: () => Promise<void>;
}

const MarkingModalNav = ({ onClose }: MarkingFormModalProps) => (
  <header className="flex justify-between">
    <h1 className="title-1">마킹하기</h1>
    <button onClick={onClose}>
      <CloseIcon />
    </button>
  </header>
);

const CurrentLocation = () => (
  <button>
    <p className="flex gap-[0.625rem]">
      <span className="text-tangerine-500">
        <MyLocationIcon />
      </span>
      <span className="btn-2">영등포구 여의도동 여의도공원</span>
    </p>
  </button>
);

type POST_VISIBILITY = "전체 공개" | "팔로우 공개" | "나만 보기";

const PermissionSelect = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const VISIBILITY_LIST: POST_VISIBILITY[] = [
    "전체 공개",
    "팔로우 공개",
    "나만 보기",
  ];

  const visibility = useMarkingFormStore((state) => state.visibility);
  const setVisibility = useMarkingFormStore((state) => state.setVisibility);

  const onClose = () => setIsOpen(false);

  const handleSelect = (value: POST_VISIBILITY) => {
    setVisibility(value);
    onClose();
  };

  return (
    <div className="relative">
      <SelectOpener
        label="보기권한 설정"
        essential
        onClick={() => setIsOpen(!isOpen)}
        placeholder="공개 범위를 설정해 주세요"
        value={visibility}
      />

      <Select isOpen={isOpen} onClose={onClose}>
        <Select.OptionList
          className={` ${isOpen ? "visible" : "hidden"} rounded-2xl shadow-custom-1 absolute top-[calc(100%+0.5rem)] w-full bg-grey-0`}
        >
          {VISIBILITY_LIST.map((option, idx) => {
            return (
              <Select.Option
                key={idx}
                value={option}
                isSelected={option === visibility}
                onClick={() => handleSelect(option)}
              >
                {option}
              </Select.Option>
            );
          })}
        </Select.OptionList>
      </Select>
    </div>
  );
};

const PhotoInput = ({
  label,
  essential = false,
}: {
  label: string;
  essential?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {/* 사진을 담을 input , sr-only로 실제 화면에 렌더링 되지 않음*/}
      <input
        type="file"
        accept=".jpeg,.jpg,.png, .webp"
        multiple
        className="sr-only"
        ref={inputRef}
        id="images"
        name="images"
      />
      {/* label */}
      <label htmlFor="images">
        <p className="flex gap-1 pb-1">
          <span className="title-3 text-grey-700">{label}</span>
          <span>{essential && <Badge colorType="primary" />}</span>
        </p>
      </label>
      {/* 담긴 사진들 */}
      <section className="flex gap-2 w-full overflow-x-auto">
        {/* 첫 번째 사진 */}
        <div className="w-[120px] h-[120px] bg-grey-200 rounded-2xl flex justify-center items-center text-grey-500 flex-shrink-0">
          <PlusIcon />
        </div>
        {/* 이후 사진들 */}
        <div className="w-[120px] h-[120px] bg-grey-200 rounded-2xl flex justify-center items-center text-grey-500 flex-shrink-0"></div>
        <div className="w-[120px] h-[120px] bg-grey-200 rounded-2xl flex justify-center items-center text-grey-500 flex-shrink-0"></div>
        <div className="w-[120px] h-[120px] bg-grey-200 rounded-2xl flex justify-center items-center text-grey-500 flex-shrink-0"></div>
        <div className="w-[120px] h-[120px] bg-grey-200 rounded-2xl flex justify-center items-center text-grey-500 flex-shrink-0"></div>
      </section>
    </div>
  );
};

const MarkingTextArea = () => {
  const setContent = useMarkingFormStore((state) => state.setContent);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <TextArea
      id="content"
      name="content"
      label="메모하기"
      placeholder="마킹에 대한 메모를 남겨주세요."
      onChange={handleChange}
    />
  );
};

const MarkingFormButtons = ({ onClose }: MarkingFormModalProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Button colorType="primary" size="medium" variant="filled">
        저장하기
      </Button>
      <Button colorType="tertiary" size="medium" variant="text">
        임시저장
      </Button>
    </div>
  );
};

export const MarkingFormModal = ({ onClose }: MarkingFormModalProps) => {
  return (
    <Modal modalType="center">
      <MarkingModalNav onClose={onClose} />
      <form action="" className="flex flex-col gap-8">
        {/* 사용자 현재 위치 */}
        <CurrentLocation />
        {/* 보기 권한 설정 */}
        <PermissionSelect />
        {/* 사진 추가하기 */}
        <PhotoInput label="사진 추가하기" essential />
        {/* 메모하기 */}
        <MarkingTextArea />
        {/* 제출 버튼들 */}
        <MarkingFormButtons onClose={onClose} />
      </form>
    </Modal>
  );
};

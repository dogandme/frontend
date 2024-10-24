import { useEffect, useRef, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { SelectOpener } from "@/entities/auth/ui";
import { useGetAddressFromLatLng } from "@/entities/marking/api";
import { useModal } from "@/shared/lib/overlay";
import { useAuthStore } from "@/shared/store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { CloseIcon, MyLocationIcon, PlusIcon } from "@/shared/ui/icon";
import { ImgSlider } from "@/shared/ui/imgSlider";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { TextArea } from "@/shared/ui/textarea";
import { usePostAddMarking, usePostAddTempMarking } from "../api";
import {
  MARKING_ADD_ERROR_MESSAGE,
  MAX_IMAGE_LENGTH,
  POST_VISIBILITY_MAP,
} from "../constants";
import { useMarkingFormStore } from "../store";
import { MarkingFormCloseModal } from "./markingFormCloseModal";

interface MarkingFormModalProps {
  onCloseMarkingModal: () => Promise<void>;
}

export const MarkingFormModal = ({
  onCloseMarkingModal,
}: MarkingFormModalProps) => {
  return (
    <Modal modalType="center">
      <MarkingModalHeader onCloseMarkingModal={onCloseMarkingModal} />
      <section className="flex flex-col gap-8">
        {/* 사용자 현재 위치 */}
        <CurrentLocation onCloseMarkingModal={onCloseMarkingModal} />
        {/* 보기 권한 설정 */}
        <PostVisibilitySelect />
        {/* 사진 추가하기 */}
        <PhotoInput />
        {/* 메모하기 */}
        <MarkingTextArea />
        {/* 제출 버튼들 */}
        <div className="flex flex-col gap-2">
          <SaveButton />
          <TemporarySaveButton />
        </div>
      </section>
    </Modal>
  );
};

const MarkingModalHeader = ({ onCloseMarkingModal }: MarkingFormModalProps) => {
  const { onClose: onCloseExitModal, handleOpen: onOpenExitModal } = useModal(
    () => (
      <MarkingFormCloseModal
        onCloseExitModal={onCloseExitModal}
        onCloseMarkingModal={onCloseMarkingModal}
      />
    ),
  );

  const handleClose = () => {
    const { isVisible, images, content } = useMarkingFormStore.getState();

    if (!isVisible && images.length === 0 && !content) {
      onCloseMarkingModal();
      return;
    }
    onOpenExitModal();
  };

  return (
    <header className="flex justify-between">
      <h1 className="title-1">마킹하기</h1>
      <button onClick={handleClose} aria-label="작성중인 마킹 게시글 닫기">
        <CloseIcon />
      </button>
    </header>
  );
};

const CurrentLocation = ({ onCloseMarkingModal }: MarkingFormModalProps) => {
  const map = useMap();
  const center = map.getCenter();

  const lat = center.lat();
  const lng = center.lng();

  const { token } = useAuthStore.getState();

  if (!token) {
    throw new Error(MARKING_ADD_ERROR_MESSAGE.UNAUTHORIZED);
  }

  const { data, isSuccess } = useGetAddressFromLatLng({ lat, lng });
  const setRegion = useMarkingFormStore((state) => state.setRegion);

  useEffect(() => {
    if (!data && !isSuccess) {
      return;
    }
    setRegion(data.region);
  }, [data, isSuccess, setRegion]);

  return (
    <button
      onClick={onCloseMarkingModal}
      className="flex gap-[0.625rem] items-center"
    >
      <span className="text-tangerine-500">
        <MyLocationIcon />
      </span>
      {isSuccess ? (
        <span className="btn-2 text-start">{data.region}</span>
      ) : (
        <span className="animate-pulse w-44 bg-grey-200 rounded-2xl"></span>
      )}
    </button>
  );
};

const PostVisibilitySelect = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const VISIBILITY_LIST = Object.keys(POST_VISIBILITY_MAP);

  const isVisible = useMarkingFormStore((state) => state.isVisible);
  const setVisibility = useMarkingFormStore((state) => state.setVisibility);

  const handleCloseSelectList = () => setIsOpen(false);

  const handleSelect = (value: keyof typeof POST_VISIBILITY_MAP) => {
    setVisibility(value);
    handleCloseSelectList();
  };

  return (
    <div className="relative">
      <SelectOpener
        label="보기권한 설정"
        essential
        onClick={() => setIsOpen(!isOpen)}
        placeholder="공개 범위를 선택해주세요"
        value={isVisible}
      />

      <Select isOpen={isOpen} onClose={handleCloseSelectList}>
        <Select.OptionList
          className={` ${isOpen ? "visible" : "hidden"} rounded-2xl shadow-custom-1 absolute top-[calc(100%+0.5rem)] w-full bg-grey-0 z-[9999]`}
        >
          {VISIBILITY_LIST.map((option) => {
            return (
              <Select.Option
                key={option}
                value={option}
                isSelected={option === isVisible}
                onClick={() =>
                  handleSelect(option as keyof typeof POST_VISIBILITY_MAP)
                }
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

const PhotoInput = () => {
  const images = useMarkingFormStore((state) => state.images);
  const setImages = useMarkingFormStore((state) => state.setImages);
  const inputKey = useMarkingFormStore((state) => state.inputKey);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenAlbum = () => {
    inputRef.current?.click();
  };

  const handleChange = async ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const { files: newFiles } = target;

    if (!newFiles) {
      return;
    }

    if (images.length + newFiles.length > MAX_IMAGE_LENGTH) {
      // TODO 에러 바운더리에서 처리 하기
      // throw new Error(`사진은 최대 ${MAX_IMAGE_LENGTH}장까지 추가할 수 있습니다`);
      console.error(`사진은 최대 ${MAX_IMAGE_LENGTH}장까지 추가할 수 있습니다`);
    }

    const AvailableNewFileArray = [...newFiles]
      .filter((newFile) => !images.some(({ name }) => name === newFile.name))
      .slice(0, MAX_IMAGE_LENGTH - images.length);

    setImages([
      ...images,
      ...AvailableNewFileArray.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      })),
    ]);
  };

  const handleRemoveImage = (name: string) => {
    setImages(images.filter((image) => image.name !== name));
  };

  return (
    <div>
      {/* 사진을 담을 input , sr-only로 실제 화면에 렌더링 되지 않음*/}
      <input
        key={inputKey}
        type="file"
        accept=".jpeg,.jpg,.png,.webp"
        multiple
        className="sr-only"
        ref={inputRef}
        id="images"
        name="images"
        onChange={handleChange}
      />
      {/* label */}
      <label htmlFor="images">
        <div className="flex gap-1 pb-1">
          <span className="title-3 text-grey-700">사진 추가하기</span>
          <span>
            <Badge colorType="primary" />
          </span>
        </div>
      </label>
      {/* 담긴 사진들 */}
      <ImgSlider>
        {images.length < 5 && (
          <ImgSlider.Item
            onClick={handleOpenAlbum}
            aria-label="마킹 게시글에 사진 추가하기"
          >
            <PlusIcon />
          </ImgSlider.Item>
        )}
        {images.map(({ url, name }) => (
          <ImgSlider.ImgItem
            src={url}
            alt={name}
            key={name}
            onRemove={() => handleRemoveImage(name)}
          />
        ))}
      </ImgSlider>
    </div>
  );
};

const MarkingTextArea = () => {
  const { content } = useMarkingFormStore.getState();
  const setContent = useMarkingFormStore((state) => state.setContent);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <TextArea
      id="content"
      name="content"
      label="메모하기"
      placeholder="마킹에 대한 메모를 남겨주세요"
      defaultValue={content}
      onChange={handleChange}
    />
  );
};

const SaveButton = () => {
  const map = useMap();

  const isCompressing = useMarkingFormStore((state) => state.isCompressing);

  const { mutate: postMarkingData } = usePostAddMarking();

  const handleSave = async () => {
    const { token } = useAuthStore.getState();

    if (!token) {
      throw new Error(MARKING_ADD_ERROR_MESSAGE.UNAUTHORIZED);
    }

    const { region, isVisible, images, content } =
      useMarkingFormStore.getState();

    if (isCompressing) {
      // TODO 에러 바운더리 생성되면 로직 변경하기
      console.error("사진을 압축 중입니다. 잠시 후 다시 시도해주세요");
      return;
    }

    const center = map.getCenter();

    if (!region) {
      throw new Error(MARKING_ADD_ERROR_MESSAGE.REGION_NOT_FOUND);
    }

    if (!isVisible || images.length === 0) {
      throw new Error(MARKING_ADD_ERROR_MESSAGE.MISSING_REQUIRED_FIELDS);
    }

    const lat = center.lat();
    const lng = center.lng();

    postMarkingData({
      lat,
      lng,
      region,
      isVisible,
      images: images.map((image) => image.file),
      content,
    });
  };

  return (
    <Button
      colorType="primary"
      size="medium"
      variant="filled"
      type="button"
      onClick={handleSave}
    >
      저장하기
    </Button>
  );
};
const TemporarySaveButton = () => {
  const map = useMap();
  const isCompressing = useMarkingFormStore((state) => state.isCompressing);

  const { mutate: postAddTempMarking } = usePostAddTempMarking();

  const handleSave = () => {
    const { token } = useAuthStore.getState();
    const { region, isVisible, images, content } =
      useMarkingFormStore.getState();

    if (!token) {
      throw new Error(MARKING_ADD_ERROR_MESSAGE.UNAUTHORIZED);
    }

    if (isCompressing) {
      // TODO 에러 바운더리 생성되면 로직 변경하기
      console.error("사진을 압축 중입니다. 잠시 후 다시 시도해주세요");
      return;
    }

    const compressedFiles = images.map((image) => image.file);

    const center = map.getCenter();

    const lat = center.lat();
    const lng = center.lng();

    postAddTempMarking({
      lat,
      lng,
      region,
      isVisible: isVisible || "전체 공개",
      images: compressedFiles,
      content,
    });
  };

  return (
    <Button
      colorType="tertiary"
      size="medium"
      variant="text"
      type="button"
      onClick={handleSave}
    >
      임시저장
    </Button>
  );
};

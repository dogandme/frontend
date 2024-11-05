import { useEffect, useRef, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { SelectOpener } from "@/entities/auth/ui";
import { useGetAddressFromLatLng } from "@/entities/marking/api";
import { useSnackBar } from "@/shared/lib";
import {
  MARKING_VISIBILITY_MAP,
  MARKING_VISIBILITY_ENTRIES,
} from "@/entities/marking/constants";
import { useAuthStore } from "@/shared/store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { MyLocationIcon, PlusIcon } from "@/shared/ui/icon";
import { ImgSlider } from "@/shared/ui/imgSlider";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { TextArea } from "@/shared/ui/textarea";
import { usePostAddMarking, usePostAddTempMarking } from "../api";
import { MARKING_ADD_ERROR_MESSAGE, MAX_IMAGE_LENGTH } from "../constants";
import { useMarkingFormStore } from "../store";

interface MarkingFormModalProps {
  onCloseMarkingModal: () => Promise<void>;
}

export const MarkingFormModal = ({
  onCloseMarkingModal,
}: MarkingFormModalProps) => {
  return (
    <Modal modalType="center">
      {/* TODO exitConfirmModal 달기 */}
      <Modal.Header
        onClick={onCloseMarkingModal}
        aria-label="작성중인 마킹 게시글 닫기"
      >
        마킹하기
      </Modal.Header>
      <Modal.Content>
        {/* 사용자 현재 위치 */}
        <CurrentLocation onCloseMarkingModal={onCloseMarkingModal} />
        {/* 보기 권한 설정 */}
        <PostVisibilitySelect />
        {/* 사진 추가하기 */}
        <PhotoInput />
        {/* 메모하기 */}
        <MarkingTextArea />
      </Modal.Content>
      {/* 제출 버튼들 */}
      <Modal.Footer axis="col">
        <SaveButton />
        <TemporarySaveButton />
      </Modal.Footer>
    </Modal>
  );
};

const CurrentLocation = ({ onCloseMarkingModal }: MarkingFormModalProps) => {
  const map = useMap();
  const handleOpenSnackbar = useSnackBar();
  const center = map.getCenter();

  const lat = center.lat();
  const lng = center.lng();

  const { data, isSuccess } = useGetAddressFromLatLng({ lat, lng });
  const setRegion = useMarkingFormStore((state) => state.setRegion);

  useEffect(() => {
    if (!data && !isSuccess) {
      return;
    }
    setRegion(data.region);
  }, [data, isSuccess, setRegion]);

  if (!useAuthStore.getState().token) {
    handleOpenSnackbar(MARKING_ADD_ERROR_MESSAGE.UNAUTHORIZED);
    return;
  }

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

  const isVisible = useMarkingFormStore((state) => state.isVisible);
  const setVisibility = useMarkingFormStore((state) => state.setVisibility);

  const handleCloseSelectList = () => setIsOpen(false);

  const handleSelect = (value: keyof typeof MARKING_VISIBILITY_MAP) => {
    setVisibility(value);
    handleCloseSelectList();
  };

  return (
    <div className="relative">
      <SelectOpener
        label="보기권한 설정"
        essential
        onClick={() => setIsOpen(!isOpen)}
        value={MARKING_VISIBILITY_MAP[isVisible]}
      />
      <Select isOpen={isOpen} onClose={handleCloseSelectList}>
        <Select.OptionList
          className={` ${isOpen ? "visible" : "hidden"} rounded-2xl shadow-custom-1 absolute top-[calc(100%+0.5rem)] w-full bg-grey-0 z-[9999]`}
        >
          {MARKING_VISIBILITY_ENTRIES.map(([key, value]) => {
            return (
              <Select.Option
                key={key}
                value={value}
                isSelected={key === isVisible}
                onClick={() => handleSelect(key)}
              >
                {value}
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
  const handleOpen = useSnackBar();

  const handleChange = async ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const { files: newFiles } = target;

    if (!newFiles) {
      return;
    }

    if (images.length + newFiles.length > MAX_IMAGE_LENGTH) {
      handleOpen(`사진은 최대 ${MAX_IMAGE_LENGTH}장까지 추가할 수 있습니다`);
    }

    const availableNewFileArray = [...newFiles]
      .filter((newFile) => !images.some(({ name }) => name === newFile.name))
      .slice(0, MAX_IMAGE_LENGTH - images.length);

    setImages([
      ...images,
      ...availableNewFileArray.map((file) => ({
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
  const handleOpen = useSnackBar();

  const handleSave = async () => {
    const { token } = useAuthStore.getState();

    if (!token) {
      handleOpen(MARKING_ADD_ERROR_MESSAGE.UNAUTHORIZED);
      return;
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
      handleOpen(MARKING_ADD_ERROR_MESSAGE.REGION_NOT_FOUND);
      return;
    }

    if (!isVisible || images.length === 0) {
      handleOpen(MARKING_ADD_ERROR_MESSAGE.MISSING_REQUIRED_FIELDS);
      return;
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
  const handleOpen = useSnackBar();
  const { mutate: postAddTempMarking } = usePostAddTempMarking();

  const handleSave = () => {
    const { token } = useAuthStore.getState();
    const { region, isVisible, images, content } =
      useMarkingFormStore.getState();

    if (!token) {
      handleOpen(MARKING_ADD_ERROR_MESSAGE.UNAUTHORIZED);
    }

    if (isCompressing) {
      handleOpen("사진을 압축 중입니다. 잠시 후 다시 시도해주세요");
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
      isVisible: isVisible,
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

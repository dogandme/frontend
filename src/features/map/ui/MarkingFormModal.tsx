import { useEffect, useRef, useState } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useMap } from "@vis.gl/react-google-maps";
import { SelectOpener } from "@/entities/auth/ui";
import { useModal, useSnackBar } from "@/shared/lib/overlay";
import { useAuthStore } from "@/shared/store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { CloseIcon, MyLocationIcon, PlusIcon } from "@/shared/ui/icon";
import { ImgSlider } from "@/shared/ui/imgSlider";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { Snackbar } from "@/shared/ui/snackbar";
import { TextArea } from "@/shared/ui/textarea";
import { useGetAddressFromLatLng } from "../api";
import { usePostMarkingForm, usePostTempMarkingForm } from "../api/form";
import { useMarkingFormStore } from "../store/form";
import { useMapStore } from "../store/map";

interface MarkingFormModalProps {
  onClose: () => Promise<void>;
}

interface LatLng {
  lat: number;
  lng: number;
}

const MarkingModalNav = ({ onClose }: MarkingFormModalProps) => {
  const setMode = useMapStore((state) => state.setMode);
  const resetMarkingFormStore = useMarkingFormStore(
    (state) => state.resetMarkingFormStore,
  );

  const { onClose: onCloseExitModal, handleOpen: onOpenExitModal } = useModal(
    () => (
      <Modal modalType="center">
        <section className="flex flex-col gap-8">
          <div className="flex justify-between">
            <span className="title-1 text-grey-900">화면을 나가시겠습니까</span>
            <button
              onClick={onCloseExitModal}
              aria-label="마킹 하기 제출 폼 닫기"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="text-grey-700 body-2">
            <p>화면을 나갈 경우 입력한 정보들이 모두 삭제 됩니다.</p>
            <p>정말 화면을 나가시겠습니까?</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="text"
              colorType="tertiary"
              size="medium"
              fullWidth={false}
              className="flex-1"
              onClick={onCloseExitModal}
            >
              취소
            </Button>
            <Button
              variant="text"
              colorType="primary"
              size="medium"
              onClick={() => {
                onCloseExitModal();
                onClose();
                resetMarkingFormStore();
                setMode("view");
              }}
              fullWidth={false}
              className="flex-1"
            >
              나가기
            </Button>
          </div>
        </section>
      </Modal>
    ),
  );

  return (
    <header className="flex justify-between">
      <h1 className="title-1">마킹하기</h1>
      <button onClick={onOpenExitModal}>
        <CloseIcon />
      </button>
    </header>
  );
};

const CurrentLocation = ({
  lat,
  lng,
  onClose,
}: LatLng & { onClose: () => Promise<void> }) => {
  const { data, isSuccess } = useGetAddressFromLatLng({ lat, lng });
  const setRegion = useMarkingFormStore((state) => state.setRegion);

  useEffect(() => {
    if (!data && !isSuccess) {
      return;
    }
    setRegion(data.region);
  }, [data, isSuccess, setRegion]);

  return (
    <button onClick={onClose}>
      <p className="flex gap-[0.625rem]">
        <span className="text-tangerine-500">
          <MyLocationIcon />
        </span>
        {isSuccess ? (
          <span className="btn-2">{data.region}</span>
        ) : (
          <span className="animate-pulse w-44 bg-grey-200 rounded-2xl"></span>
        )}
      </p>
    </button>
  );
};

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
          className={` ${isOpen ? "visible" : "hidden"} rounded-2xl shadow-custom-1 absolute top-[calc(100%+0.5rem)] w-full bg-grey-0 z-[9999]`}
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
  const images = useMarkingFormStore((state) => state.images);
  const setImages = useMarkingFormStore((state) => state.setImages);

  // imageUrls 는 이미지 파일을 렌더링 하기 위해 사용되며 lastModified 는 images 내부 파일들을
  // 식별 하기 위한 식별자로 사용됩니다.
  const imageUrls = images.map((image) => ({
    url: URL.createObjectURL(image),
    lastModified: image.lastModified,
    name: image.name,
  }));

  const handleOpenAlbum = () => {
    inputRef.current?.click();
  };

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { files: newFiles } = target;
    if (!newFiles) {
      return;
    }

    // TODO 이미지 파일 최적화 위해 용량 줄이기

    const isImageAlreadyExist = (newFile: File) => {
      return images.some(
        (image) => image.lastModified === newFile.lastModified,
      );
    };

    const _images = [...images];
    for (const newFile of newFiles) {
      if (_images.length > 5) {
        throw new Error("사진은 5장까지 이용 가능 합니다.");
      }

      if (!isImageAlreadyExist(newFile)) {
        _images.push(newFile);
      }
    }

    setImages([..._images]);
  };

  const handleRemoveImage = (lastModified: number) => {
    setImages(images.filter((image) => image.lastModified !== lastModified));
  };

  return (
    <div>
      {/* 사진을 담을 input , sr-only로 실제 화면에 렌더링 되지 않음*/}
      <input
        type="file"
        accept=".jpeg,.jpg,.png, .webp"
        multiple
        max={5}
        className="sr-only"
        ref={inputRef}
        id="images"
        name="images"
        onChange={handleChange}
      />
      {/* label */}
      <label htmlFor="images">
        <div className="flex gap-1 pb-1">
          <span className="title-3 text-grey-700">{label}</span>
          <span>{essential && <Badge colorType="primary" />}</span>
        </div>
      </label>
      {/* 담긴 사진들 */}
      <ImgSlider>
        {imageUrls.length < 5 && (
          <ImgSlider.Item onClick={handleOpenAlbum}>
            <PlusIcon />
          </ImgSlider.Item>
        )}
        {imageUrls.map(({ url, name, lastModified }, idx) => (
          <ImgSlider.ImgItem
            src={url}
            alt={name}
            key={idx}
            onRemove={() => handleRemoveImage(lastModified)}
          />
        ))}
      </ImgSlider>
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

interface FormData {
  token: string;
  region: string;
  visibility: string;
  content: string;
  images: File[];
  lat: number;
  lng: number;
}

interface MarkingFormButtonProps {
  handleExitEditMode: () => void;
  formData: FormData;
}

const SaveButton = ({
  handleExitEditMode,
  formData,
}: MarkingFormButtonProps) => {
  const { token, ...formObj } = formData;
  const { handleOpen: onOpenSnackbar, onClose } = useSnackBar(() => (
    <Snackbar onClose={onClose}>
      <p className="body-2 text-grey-700">내 마킹이 추가되었습니다.</p>
    </Snackbar>
  ));

  const { mutate: postMarkingData } = usePostMarkingForm(
    { token, ...formObj },
    {
      onSuccess: () => {
        handleExitEditMode();
        onOpenSnackbar();
      },
      onError: (error) => {
        throw new Error(error.message);
      },
    },
  );

  return (
    <Button
      colorType="primary"
      size="medium"
      variant="filled"
      type="button"
      onClick={() => postMarkingData({ token, ...formObj })}
    >
      저장하기
    </Button>
  );
};
const TemporarySaveButton = ({
  handleExitEditMode,
  formData,
}: MarkingFormButtonProps) => {
  const { token, ...formObj } = formData;
  const { handleOpen: onOpenSnackbar, onClose } = useSnackBar(() => (
    <Snackbar onClose={onClose}>
      <p className="flex flex-col body-2 text-grey-700">
        <span>임시저장 되었습니다.</span>
        <span>내 마킹에서 저장을 완료해 주세요</span>
      </p>
    </Snackbar>
  ));

  const { mutate: postTempMarkingData } = usePostTempMarkingForm(
    {
      token,
      ...formObj,
    },
    {
      onSuccess: () => {
        handleExitEditMode();
        onOpenSnackbar();
      },
      onError: (error) => {
        throw new Error(error.message);
      },
    },
  );

  return (
    <Button
      colorType="tertiary"
      size="medium"
      variant="text"
      type="button"
      onClick={() => postTempMarkingData({ token, ...formObj })}
    >
      임시저장
    </Button>
  );
};

const MarkingFormButtons = ({
  onClose,
  lat,
  lng,
}: MarkingFormModalProps & LatLng) => {
  const { token } = useAuthStore.getState();
  const setMode = useMapStore((state) => state.setMode);
  const resetMarkingFormStore = useMarkingFormStore(
    (state) => state.resetMarkingFormStore,
  );

  if (!token) {
    throw new Error("로그인 후 이용해 주세요");
  }

  const { region, visibility, content, images } =
    useMarkingFormStore.getState();

  const formData = {
    token,
    region,
    visibility,
    content,
    images,
    lat,
    lng,
  };

  const handleExitEditMode = () => {
    onClose();
    setMode("view");
    resetMarkingFormStore();
  };

  return (
    <div className="flex flex-col gap-2">
      <SaveButton handleExitEditMode={handleExitEditMode} formData={formData} />
      <TemporarySaveButton
        handleExitEditMode={handleExitEditMode}
        formData={formData}
      />
    </div>
  );
};

export const MarkingFormModal = ({ onClose }: MarkingFormModalProps) => {
  const center = useMap().getCenter();
  const lat = center.lat();
  const lng = center.lng();

  return (
    <Modal modalType="center">
      <MarkingModalNav onClose={onClose} />
      <section className="flex flex-col gap-8">
        {/* 사용자 현재 위치 */}
        <CurrentLocation lat={lat} lng={lng} onClose={onClose} />
        {/* 보기 권한 설정 */}
        <PermissionSelect />
        {/* 사진 추가하기 */}
        <PhotoInput label="사진 추가하기" essential />
        {/* 메모하기 */}
        <MarkingTextArea />
        {/* 제출 버튼들 */}
        <MarkingFormButtons onClose={onClose} lat={lat} lng={lng} />
      </section>
    </Modal>
  );
};

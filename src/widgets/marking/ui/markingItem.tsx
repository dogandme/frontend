import { useState, useRef, useEffect } from "react";
import { FollowingToggle } from "@/features/follow/ui";
import { useDeleteMarking } from "@/features/marking/api";
import {
  useDeleteLikeMarking,
  usePostLikeMarking,
} from "@/features/marking/api";
import {
  useDeleteSavedMarking,
  usePostSaveMarking,
} from "@/features/marking/api";
import type { PutModifyMarkingArguments } from "@/features/marking/api";
import { useMarkingFormModal } from "@/features/marking/lib";
import { EditMarkingFormModal } from "@/features/marking/ui";
import type { Marking } from "@/entities/marking/api";
import { useGetMyProfile } from "@/entities/profile/api";
import type { PetInfo } from "@/entities/profile/api";
import { EmptyProfileImage, ProfileImage } from "@/entities/profile/ui";
import { API_BASE_URL } from "@/shared/constants";
import {
  formatDateToYearMonthDay,
  useDropdown,
  useImageState,
} from "@/shared/lib";
import { useSnackBar } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { Button } from "@/shared/ui/button";
import { DividerLine } from "@/shared/ui/divider";
import {
  FilledLikeIcon,
  LikeIcon,
  BookmarkIcon,
  FilledBookmarkIcon,
  MoreIcon,
  MyLocationIcon,
} from "@/shared/ui/icon";
import { ImgSlider } from "@/shared/ui/imgSlider";
import { List } from "@/shared/ui/list";
import {
  MarkingItemContext,
  useMarkingItemProps,
  type MarkingItemContextValue,
} from "../store";

export interface MarkingItemProps
  extends Omit<Marking, "isTempSaved" | "userId" | "pet"> {
  onRegionClick: ({
    lat,
    lng,
    markingId,
  }: Pick<Marking, "lat" | "lng" | "markingId">) => void;
  onDelete?: () => void;
  pet: Pick<PetInfo, "petId" | "profile" | "name">;
  queryKeys?: PutModifyMarkingArguments["queryKeys"];
}

const MarkingItemPropsProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: MarkingItemContextValue;
}) => (
  <MarkingItemContext.Provider value={value}>
    {children}
  </MarkingItemContext.Provider>
);

export const MarkingItem = (props: MarkingItemProps) => {
  const { data: myProfile, isLoading: isMyProfileLoading } = useGetMyProfile();
  const {
    myFollowingIdsMap = {},
    myLikedIdsMap = {},
    myBookmarkIdsMap = {},
  } = myProfile || {};

  const token = useAuthStore((state) => state.token);

  // TODO 로딩 처리 하기
  // TODO 마킹 아이템 로딩 처리 시 처리 하기
  if (isMyProfileLoading) {
    return <div>loading ...</div>;
  }

  const renderFollowingToggle = () => {
    const { isOwner, nickName, markingId } = props;

    if (!token) {
      return <UnAuthorizedFollowingButton />;
    }

    if (isOwner) {
      return null;
    }

    return (
      <FollowingToggle
        nickname={nickName}
        size="xSmall"
        isFollowing={myFollowingIdsMap[markingId]}
      />
    );
  };

  return (
    <MarkingItemPropsProvider
      value={{
        ...props,
        isFollowing: myFollowingIdsMap[props.markingId],
        isBookmarked: myBookmarkIdsMap[props.markingId],
        isLiked: myLikedIdsMap[props.markingId],
      }}
    >
      <li className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <MarkingItemRegion />
          {props.isOwner && <MarkingManageButton />}
        </div>
        <header className="flex items-center justify-between">
          <div className="flex justify-between items-center gap-1 ">
            <MarkingItemProfileImage />
            <MarkingItemNickname />
            <DividerLine axis="col" />
            <MarkingItemPetName />
          </div>
          {renderFollowingToggle()}
        </header>
        <main className="flex flex-col gap-2">
          <MarkingItemImages />
          <div className="flex justify-between">
            {token ? <MarkingItemLikeToggle /> : <UnauthorizedLikeButton />}
            {token ? (
              <MarkingItemBookmarkToggle />
            ) : (
              <UnAuthorizedBookmarkButton />
            )}
          </div>
        </main>
        <footer className="flex flex-col gap-2">
          <MarkingItemContent />
          <MarkingItemDate />
        </footer>
      </li>
    </MarkingItemPropsProvider>
  );
};

export const MarkingItemSkeleton = () => {
  return (
    <li className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <MarkingItemRegionSkeleton />
      </div>
      <header className="flex items-center justify-between">
        <div className="flex justify-between items-center gap-1 ">
          <MarkingItemProfileImageSkeleton />
          <MarkingItemNicknameSkeleton />
          <DividerLine axis="col" />
          <MarkingItemPetNameSkeleton />
        </div>
        <Button
          size="xSmall"
          variant="filled"
          colorType="primary"
          fullWidth={false}
          className="skeleton"
        >
          <div className="w-12" />
        </Button>
      </header>
      <main className="flex flex-col gap-2">
        <MarkingItemImagesSkeleton />
        <div className="flex justify-between skeleton">
          <div className="flex gap-2 items-center">
            <BookmarkIcon />
            <span className="title-3 ">99</span>
          </div>
          <div className="flex gap-2 items-center skeleton">
            <LikeIcon />
            <span className="title-3">99</span>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2">
        <MarkingItemContentSkeleton />
        <MarkingItemDateSkeleton />
      </footer>
    </li>
  );
};

const UnAuthorizedFollowingButton = () => {
  const handleOpenSnackbar = useSnackBar();

  return (
    <Button
      variant="filled"
      colorType="primary"
      fullWidth={false}
      size="xSmall"
      onClick={() =>
        handleOpenSnackbar("로그인 후 이용해 주세요", { type: "map" })
      }
    >
      팔로우
    </Button>
  );
};

const MarkingItemLikeToggle = () => {
  const { markingId, countData, isLiked } = useMarkingItemProps();
  const [_isLiked, _setIsLiked] = useState<boolean>(() => isLiked);
  const [_likedCount, _setLikedCount] = useState<number>(
    () => countData.likedCount,
  );

  const { mutate: postLikeMarking, isPending: isPostLikeMarkingPending } =
    usePostLikeMarking();
  const { mutate: deleteLikeMarking, isPending: isDeleteLikeMarkingPending } =
    useDeleteLikeMarking();

  const isPending = isPostLikeMarkingPending || isDeleteLikeMarkingPending;

  const handleClickLikeButton = () => {
    _setIsLiked(true);
    _setLikedCount((prev) => prev + 1);

    postLikeMarking(
      { markingId },
      {
        onError: () => {
          _setIsLiked(false);
          _setLikedCount((prev) => prev - 1);
        },
      },
    );
  };

  const handleClickUnLikeButton = () => {
    _setIsLiked(false);
    _setLikedCount((prev) => prev - 1);

    deleteLikeMarking(
      { markingId },
      {
        onError: () => {
          _setIsLiked(true);
          _setLikedCount((prev) => prev + 1);
        },
      },
    );
  };

  return (
    <div className="flex gap-2 items-center text-grey-500">
      {_isLiked ? (
        <button
          aria-label={`${markingId} 번 마킹 좋아요 취소`}
          onClick={handleClickUnLikeButton}
          disabled={isPending}
          className="text-tangerine-500"
        >
          <FilledLikeIcon />
        </button>
      ) : (
        <button
          aria-label={`${markingId} 번 마킹 좋아요 추가`}
          onClick={handleClickLikeButton}
          disabled={isPending}
        >
          <LikeIcon />
        </button>
      )}
      <span className="title-3">{_likedCount > 0 && _likedCount}</span>
    </div>
  );
};

const UnauthorizedLikeButton = () => {
  const { markingId, countData } = useMarkingItemProps();
  const { likedCount } = countData;
  const handleOpenSnackbar = useSnackBar();

  return (
    <div className="flex gap-2 items-center text-grey-500">
      <button
        aria-label={`${markingId} 번 마킹 좋아요 추가`}
        onClick={() =>
          handleOpenSnackbar("로그인 후 이용해 주세요", { type: "map" })
        }
      >
        <LikeIcon />
      </button>
      <span className="title-3">{likedCount > 0 && countData.likedCount}</span>
    </div>
  );
};

const MarkingItemBookmarkToggle = () => {
  const { isBookmarked, markingId, countData } = useMarkingItemProps();
  const [_isBookmarked, _setIsBookmarked] = useState<boolean>(
    () => isBookmarked,
  );
  const [_savedCount, _setSavedCount] = useState<number>(
    () => countData.savedCount,
  );

  const { mutate: postSaveMarking, isPending: isPostSaveMarkingPending } =
    usePostSaveMarking();
  const { mutate: deleteSaveMarking, isPending: isDeleteSaveMarkingPending } =
    useDeleteSavedMarking();

  const isPending = isPostSaveMarkingPending || isDeleteSaveMarkingPending;

  const handleClickSaveButton = () => {
    _setIsBookmarked(true);
    _setSavedCount((prev) => prev + 1);

    postSaveMarking(
      { markingId },
      {
        onError: () => {
          _setIsBookmarked(false);
          _setSavedCount((prev) => prev - 1);
        },
      },
    );
  };

  const handleClickUnSaveButton = () => {
    _setIsBookmarked(false);
    _setSavedCount((prev) => prev - 1);

    deleteSaveMarking(
      { markingId },
      {
        onError: () => {
          _setIsBookmarked(true);
          _setSavedCount((prev) => prev + 1);
        },
      },
    );
  };

  return (
    <div className="flex gap-2 items-center text-grey-500">
      {_isBookmarked ? (
        <button
          className="text-tangerine-500"
          onClick={handleClickUnSaveButton}
          disabled={isPending}
          aria-label={`${markingId} 번 마킹 저장하기 취소`}
        >
          <FilledBookmarkIcon />
        </button>
      ) : (
        <button
          onClick={handleClickSaveButton}
          disabled={isPending}
          aria-label={`${markingId} 번 마킹 저장하기`}
        >
          <BookmarkIcon />
        </button>
      )}
      <span className="title-3">{_savedCount > 0 && _savedCount}</span>
    </div>
  );
};

const UnAuthorizedBookmarkButton = () => {
  const { markingId, countData } = useMarkingItemProps();
  const { savedCount } = countData;
  const handleOpenSnackbar = useSnackBar();

  return (
    <div className="flex gap-2 items-center text-grey-500">
      <button
        className="text-grey-500"
        aria-label={`${markingId} 번 마킹 저장하기`}
        onClick={() =>
          handleOpenSnackbar("로그인 후 이용해 주세요", { type: "map" })
        }
      >
        <BookmarkIcon />
      </button>
      <span className="title-3">{savedCount > 0 && savedCount}</span>
    </div>
  );
};

const MarkingManageButton = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useDropdown(ref);
  const { markingId, onDelete } = useMarkingItemProps();

  const { mutate: deleteMarking } = useDeleteMarking({
    onSuccess: () => {
      onDelete?.();
    },
  });

  const handleDeleteMarking = () => {
    const { token, role } = useAuthStore.getState();

    if (token && role === "ROLE_USER") {
      deleteMarking({ markingId });
    }

    setIsOpen(false);
  };

  return (
    <div className="relative h-fit flex" ref={ref}>
      <button
        className="text-grey-500"
        aria-label="마킹 수정 및 삭제하기 모달을 여는 버튼"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <MoreIcon />
      </button>
      <List
        className={`${isOpen ? "visible" : "hidden"} rounded-2xl shadow-custom-1 absolute top-[calc(100%+0.5rem)] right-0 bg-grey-0 p-4`}
        style={{
          width: "11.625rem",
        }}
      >
        <EditMyMarkingModalOpenItem
          handleCloseDropDown={() => setIsOpen(false)}
        />
        <List.Item style={{ height: "3rem" }} onClick={handleDeleteMarking}>
          삭제하기
        </List.Item>
      </List>
    </div>
  );
};

interface EditMyMarkingModalOpenItemProps {
  handleCloseDropDown: () => void;
}

const EditMyMarkingModalOpenItem = ({
  handleCloseDropDown,
}: EditMyMarkingModalOpenItemProps) => {
  const {
    markingId,
    region,
    content,
    images,
    isVisible,
    queryKeys = [],
  } = useMarkingItemProps();

  const { handleOpen: handleOpenMarkingModal, onClose } = useMarkingFormModal(
    () => (
      <EditMarkingFormModal
        onClose={onClose}
        markingId={markingId}
        initialState={{
          region,
          content,
          isVisible,
          externalImages: images,
        }}
        putModifyMarkingArgumets={{
          endPoint: "PUT_MODIFY_MARKING",
          queryKeys,
        }}
      />
    ),
  );

  return (
    <List.Item
      style={{ height: "3rem" }}
      onClick={() => {
        handleCloseDropDown();
        handleOpenMarkingModal();
      }}
    >
      수정하기
    </List.Item>
  );
};

const MarkingItemImages = () => {
  const { images, pet, markingId } = useMarkingItemProps();
  const imageUrls = images.map(({ imageUrl, id }) => ({
    src: `${API_BASE_URL}/markings/image/${markingId}/${imageUrl}`,
    alt: `${pet.name}의 마킹 이미지`,
    id,
  }));
  const { isLoading, imageState } = useImageState(
    imageUrls.map(({ src }) => src),
  );

  if (isLoading) {
    return (
      <ImgSlider>
        {imageUrls.map((_, idx) => (
          <ImgSlider.ImgItemSkeleton key={idx} />
        ))}
      </ImgSlider>
    );
  }

  return (
    <ImgSlider>
      {imageUrls.map(({ src, alt, id }) => {
        const { isSuccess } = imageState[src];
        return (
          <ImgSlider.ImgItem
            key={id}
            src={isSuccess ? src : "/failed_image.png"}
            alt={alt}
          />
        );
      })}
    </ImgSlider>
  );
};

const MarkingItemImagesSkeleton = () => (
  <ImgSlider>
    {Array.from({ length: 5 }).map((_, idx) => (
      <ImgSlider.ImgItemSkeleton key={idx} />
    ))}
  </ImgSlider>
);

const MarkingItemRegion = () => {
  const { onRegionClick, region, lat, lng, markingId } = useMarkingItemProps();
  return (
    <div
      className="flex pr-4 justify-center items-center gap-[.625rem] h-8 text-tangerine-500 cursor-pointer"
      onClick={() => {
        onRegionClick?.({ lat, lng, markingId });
      }}
    >
      <MyLocationIcon />
      <h2 className="btn-2 text-grey-900">{region}</h2>
    </div>
  );
};

const MarkingItemRegionSkeleton = () => (
  <div className="flex pr-4 justify-center items-center gap-[.625rem] h-8 text-tangerine-500 cursor-pointer">
    <MyLocationIcon />
    <h2 className="btn-2 skeleton">loading loading loading</h2>
  </div>
);

const MarkingItemProfileImage = () => {
  const { pet, nickName } = useMarkingItemProps();
  const { profile } = pet;

  if (profile) {
    return (
      <ProfileImage
        imageUrl={profile}
        size="medium"
        nickname={nickName}
        className="rounded-2xl"
      />
    );
    return <EmptyProfileImage size="medium" className="rounded-2xl" />;
  }
};

const MarkingItemProfileImageSkeleton = () => (
  <div className="w-8 h-8 rounded-2xl skeleton" />
);

const MarkingItemNickname = () => {
  const { nickName } = useMarkingItemProps();
  return <span className="title-3 text-grey-700">{nickName}</span>;
};

const MarkingItemNicknameSkeleton = () => (
  <span className="body-2 skeleton">loading</span>
);

const MarkingItemPetName = () => {
  const { pet } = useMarkingItemProps();
  return <span className="body-2 text-grey-500">{pet.name}</span>;
};

const MarkingItemPetNameSkeleton = () => (
  <span className="body-2 skeleton">loading</span>
);

const MarkingItemContent = () => {
  const { content } = useMarkingItemProps();
  const [isSummary, setIsSummary] = useState<boolean>(true);
  const [isMultiLineSummaryEllipsis, setIsMultiLineSummaryEllipsis] =
    useState<boolean>(false);

  const multiLineSummaryRef = useRef<HTMLParagraphElement>(null);

  const renderMarkingContent = () => {
    const multiLineContent = content.split("\n");
    const multiLineLength = multiLineContent.length;

    if (multiLineLength > 1) {
      return isSummary ? (
        <>
          <p>{multiLineContent[0]}</p>
          <p ref={multiLineSummaryRef}>
            {multiLineContent[1]}
            {!isMultiLineSummaryEllipsis && multiLineLength > 2 && "..."}
          </p>
        </>
      ) : (
        multiLineContent.map((line, index) => (
          <p className="min-h-4" key={index}>
            {line}
          </p>
        ))
      );
    }
    return content;
  };

  // 멀티 라인의 두 번째 줄에는 필수적으로 ... 를 붙혀 하위에 렌더링 되지 않은 줄이 있음을 표현 해줍니다.
  // 이를 위해 멀티라인의 두 번쨰 줄이 ellipsis 되었는지 확인하고 , 그렇지 않다면 인위적으로 ...을 붙혀주기 위해 상태를 변경합니다.
  useEffect(() => {
    const $multiLineSummaryText = multiLineSummaryRef.current;

    if ($multiLineSummaryText) {
      setIsMultiLineSummaryEllipsis(
        $multiLineSummaryText.scrollWidth > $multiLineSummaryText.clientWidth,
      );
    }
  }, []);

  return (
    <div
      className={`body-2  text-grey-700 ${isSummary ? "line-clamp-2" : ""}`}
      onClick={() => setIsSummary((prev) => !prev)}
    >
      {renderMarkingContent()}
    </div>
  );
};

const MarkingItemContentSkeleton = () => (
  <div className="body-2 line-clamp-2 skeleton">
    loading loading loading loading loading loading loading loading loading
    loading
  </div>
);

const MarkingItemDate = () => {
  const { regDt } = useMarkingItemProps();
  return (
    <p className="body-3 text-grey-500">{formatDateToYearMonthDay(regDt)}</p>
  );
};

const MarkingItemDateSkeleton = () => (
  <p className="body-3 skeleton">loading</p>
);

import { Button } from "@/shared/ui/button";
import {
  BookmarkIcon,
  FilledBookmarkIcon,
  FilledLikeIcon,
  LikeIcon,
  MoreIcon,
  MyLocationIcon,
} from "@/shared/ui/icon";
import { ImgSlider } from "@/shared/ui/imgSlider";

interface CountData {
  likedCount: number;
  savedCount: number;
}

interface Pet {
  petId: number;
  name: string;
  profile: string;
}

interface Image {
  id: number;
  imageUrl: string;
  lank: number;
  regDt: string;
}

interface CountData {
  likedCount: number;
  savedCount: number;
}

interface Pet {
  petId: number;
  name: string;
  profile: string;
}

interface Image {
  id: number;
  imageUrl: string;
  lank: number;
  regDt: string;
}

interface ContentItemProps {
  markingId: number;
  region: string;
  content: string;
  isVisible: string;
  regDt: string;
  userId: number;
  nickName: string;
  isOwner: boolean;
  isTempSaved: boolean; // 이 컴포넌트에서 사용하지 x
  lat: number;
  lng: number;
  countData: CountData;
  pet: Pet;
  images: Image[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

const ContentItem = ({
  region,
  pet,
  images,
  content,
  regDt,
  isOwner = false,
  countData: { likedCount, savedCount },
}: ContentItemProps) => {
  const isLiked = false;
  const isBookmarked = false;

  return (
    <li className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex pr-4 justify-center items-center gap-[.625rem] h-8 text-tangerine-500">
          <MyLocationIcon />
          <h2 className="btn-2 text-grey-900">{region}</h2>
        </div>

        {isOwner && (
          <button className="text-grey-500" aria-label="마킹 수정 및 삭제하기">
            <MoreIcon />
          </button>
        )}
      </div>

      <div className="flex justify-between items-center gap-1 flex-1">
        <img className="w-8 h-8 rounded-2xl" src={pet.profile} alt={pet.name} />
        <span className="flex-1 title-3 text-grey-700">{pet.name}</span>

        {!isOwner && (
          <Button
            colorType="tertiary"
            size="xSmall"
            variant="outlined"
            fullWidth={false}
          >
            팔로우
          </Button>
        )}
      </div>

      <ImgSlider>
        {images.map(({ imageUrl, id }) => (
          <ImgSlider.ImgItem
            key={id}
            src={imageUrl}
            alt={`${pet.name}-marking-image-${id}`}
          />
        ))}
      </ImgSlider>

      <div className="flex justify-between">
        <div className="flex gap-2 items-center text-grey-500">
          <button
            className={isLiked ? "text-tangerine-500" : ""}
            aria-label="마킹 좋아요"
          >
            {isLiked ? <FilledLikeIcon /> : <LikeIcon />}
          </button>
          <span className="title-3">{likedCount > 0 && likedCount}</span>
        </div>

        <div className="flex gap-2 items-center text-grey-500">
          <button
            className={isBookmarked ? "text-tangerine-500" : ""}
            aria-label="마킹 저장하기"
          >
            {isBookmarked ? <FilledBookmarkIcon /> : <BookmarkIcon />}
          </button>
          <span className="title-3">{savedCount > 0 && savedCount}</span>
        </div>
      </div>

      <p className="text-grey-700 body-2 text-overflow">{content}</p>

      <p className="body-3 text-grey-500">{formatDate(regDt)}</p>
    </li>
  );
};

export default ContentItem;

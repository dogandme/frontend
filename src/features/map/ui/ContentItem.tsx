import {
  BookmarkIcon,
  LikeIcon,
  MoreIcon,
  MyLocationIcon,
} from "@/shared/ui/icon";
import { ImgSlider } from "@/shared/ui/imgSlider";

interface ContentItemProps {
  address: string;
  content: string;
  date: string;
  likeCount: number;
  bookmarkCount: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

const ContentItem = ({
  address,
  content,
  date,
  likeCount,
  bookmarkCount,
}: ContentItemProps) => {
  return (
    <li className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex pr-4 justify-center items-center gap-[.625rem] h-8 text-tangerine-500">
          <MyLocationIcon />
          <h2 className="btn-2 text-grey-900">{address}</h2>
        </div>

        <button className="text-grey-500" aria-label="마킹 수정 및 삭제하기">
          <MoreIcon />
        </button>
      </div>

      <ImgSlider>
        <ImgSlider.ImgItem src="https://via.placeholder.com/150" alt="1" />
      </ImgSlider>

      <div className="flex gap-4 flex-end">
        <div className="flex items-center gap-1 flex-1">
          <img
            className="w-8 h-8 rounded-2xl"
            src="https://via.placeholder.com/150"
            alt="petname"
          />
          <span className="title-3 text-grey-700">petname</span>
        </div>

        <div className="flex gap-2 items-center text-grey-500">
          <button aria-label="마킹 좋아요">
            <LikeIcon />
          </button>
          <span className="title-3">{likeCount > 0 && likeCount}</span>
        </div>

        <div className="flex gap-2 items-center text-grey-500">
          <button aria-label="마킹 저장하기">
            <BookmarkIcon />
          </button>
          <span className="title-3">{bookmarkCount > 0 && bookmarkCount}</span>
        </div>
      </div>

      <p className="text-grey-700 body-2 text-overflow">{content}</p>

      <p className="body-3 text-grey-500">{formatDate(date)}</p>
    </li>
  );
};

export default ContentItem;

import { HTMLAttributes, ImgHTMLAttributes, ReactNode, useRef } from "react";
import { CloseIcon } from "../icon";

const ImgItem = ({
  onRemove,
  ...props
}: { onRemove?: () => void } & ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <div className="relative w-[7.5rem] h-[7.5rem] bg-grey-200 rounded-2xl flex justify-center items-center text-grey-500 flex-shrink-0">
      <img className="w-full h-full object-cover no-drag" {...props} />
      {onRemove && (
        <button
          className="absolute w-6 h-6 top-1 right-1 bg-tangerine-500 rounded-2xl"
          onClick={onRemove}
        >
          <CloseIcon fill="grey-0" />
        </button>
      )}
    </div>
  );
};

const Item = ({
  children,
  ...props
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="relative w-[7.5rem] h-[7.5rem] bg-grey-200 rounded-2xl flex justify-center items-center text-grey-500 flex-shrink-0"
      {...props}
    >
      {children}
    </div>
  );
};

const SliderMain = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);

  // section 요소 내에서 드래그 시작 지점의 x 좌표
  const startX = useRef(0);

  // section 요소의 스크롤 위치
  const scrollLeft = useRef(0);

  // 마우스 누를 때 발생
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;

    startX.current = e.pageX - (ref.current?.offsetLeft || 0);
    scrollLeft.current = ref.current?.scrollLeft || 0;
  };

  // 마우스를 section 안에서 바깥으로 옮겼을 때
  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  // 마우스 뗄 때 발생
  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // section에서 마우스를 움직였을 때
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    e.preventDefault();

    const x = e.pageX - (ref.current?.offsetLeft || 0);
    const move = (x - startX.current) * 1.3;

    if (ref.current) {
      ref.current.scrollLeft = scrollLeft.current - move;
    }
  };

  return (
    <div
      ref={ref}
      className="flex gap-2 w-full overflow-x-auto"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
};

const Slider = Object.assign(SliderMain, { Item, ImgItem });

export default Slider;

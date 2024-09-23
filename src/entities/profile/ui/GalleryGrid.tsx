import { useAuthStore } from "@/shared/store";

interface GalleryGridProps {
  images: string[];
}

export const GalleryGrid = ({ images }: GalleryGridProps) => {
  const role = useAuthStore((state) => state.role);
  // TODO userInfo API 나오면 변경하기
  const profileImg = "/default-image.png";

  if (role !== "ROLE_USER" || images.length === 0) {
    return (
      <div className="px-4 py-4 flex items-center justify-center flex-col gap-4 w-full h-[20.5rem] rounded-2xl bg-grey-50">
        <img
          src={profileImg}
          alt="profileImage"
          className="w-16 h-16 rounded-[28px] flex-shrink-0 "
        />
        <div className="text-center body-2 text-grey-500">
          <p>함께 한 특별한 장소를 마킹하고</p>
          <p>추억을 남겨보세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      {/* TODO alt 추가하기 */}
      {images.map((src, index) => (
        <img
          src={src}
          key={index}
          className="w-full h-full object-cover rounded-lg aspect-square"
        />
      ))}
    </div>
  );
};

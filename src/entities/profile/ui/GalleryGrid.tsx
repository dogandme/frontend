import type { AuthStore } from "@/shared/store";

interface GalleryGridProps extends Pick<AuthStore, "role"> {
  images: string[];
  profileImage: string;
}

export const GalleryGrid = ({
  role,
  images,
  profileImage,
}: GalleryGridProps) => {
  if (role !== "ROLE_USER" || images.length === 0) {
    return (
      <div className="px-4 py-4 flex items-center justify-center flex-col gap-4 w-full h-[20.5rem] rounded-2xl bg-grey-50">
        <img
          src={profileImage}
          alt="profileImage"
          className="w-16 h-16 rounded-2xl flex-shrink-0 "
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

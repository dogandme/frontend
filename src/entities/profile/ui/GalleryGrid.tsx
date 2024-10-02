import type {
  MarkingPreviewData,
  ProfileImageUrl,
} from "@/entities/profile/api";

interface GalleryGridProps {
  markings: MarkingPreviewData[];
  profile?: ProfileImageUrl;
}

/**
 * GalleryGrid 는 ROLE_USER 이상 일 때 나타나는 컴포넌트 입니다.
 * 다만 렌더링 할 마킹이 없다면 해당 유저의 프로필 이미지를 이용해 EmptyGalleryGrid 를 렌더링 합니다.
 */
export const GalleryGrid = ({
  markings,
  profile = "/default-profile.png",
}: GalleryGridProps) => {
  if (markings.length === 0) {
    return <EmptyGalleryGrid profile={profile} />;
  }

  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      {markings.map(({ id, image }) => (
        <img
          src={image}
          key={id}
          alt={`마킹 번호 ${id}의 썸네일 이미지`}
          className="w-full h-full object-cover rounded-lg aspect-square"
        />
      ))}
    </div>
  );
};

/**
 * EmptyGalleryGrid 는 ROLE_USER 가 아니거나 렌더링 할 마킹 리스트가 없을 때 나타나는 컴포넌트 입니다.
 * MyPage 에선 role 에 따라 렌더링 되며 남의 프로필에선 마킹 리스트가 존재하지 않을 때 GalleryGrid 내에서 호출 됩니다.
 */
export const EmptyGalleryGrid = ({ profile }: { profile: ProfileImageUrl }) => (
  <div className="px-4 py-4 flex items-center justify-center flex-col gap-4 w-full h-[20.5rem] rounded-2xl bg-grey-50">
    <img
      src={profile}
      alt="profileImage"
      className="w-16 h-16 rounded-2xl flex-shrink-0 "
    />
    <div className="text-center body-2 text-grey-500">
      <p>함께 한 특별한 장소를 마킹하고</p>
      <p>추억을 남겨보세요</p>
    </div>
  </div>
);

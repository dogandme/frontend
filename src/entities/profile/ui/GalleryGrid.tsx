interface GalleryGridProps {
  images: string[];
}

export const GalleryGrid = ({ images }: GalleryGridProps) => {
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

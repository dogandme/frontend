export const profileMarkingThumbnail: Record<
  string,
  { markingId: number; previewImage: string; lat: number; lng: number }[]
> = {
  뽀송송: Array.from(
    {
      length: 120,
    },
    (_, i) => ({
      markingId: i,
      previewImage: `a18b127f-06e6-4954-9f45-${Math.ceil(Math.random() * 100000)}a7299a`,
      lat: Math.random() > 0.5 ? 35 + Math.random() : 35 - Math.random(),
      lng: Math.random() > 0.5 ? 129 + Math.random() : 129 - Math.random(),
    }),
  ),
};

export const regionQueryKey = {
  regionAll: ["regions"] as const,
  regionKeyword: (keyword: string) =>
    [...regionQueryKey.regionAll, { keyword }] as const,
  regionLatLng: (latLng: { lat: number; lng: number }) =>
    [...regionQueryKey.regionAll, { latLng }] as const,
} as const;

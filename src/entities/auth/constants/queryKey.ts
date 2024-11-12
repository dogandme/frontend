// TODO 타입 리팩토링 시 건들기
interface LatLng {
  lat: number;
  lng: number;
}

export const authQueryKey = {
  myInfo: () => ["myInfo"] as const,
  regionAll: () => ["regions"] as const,
  regionKeyword: (keyword: string) =>
    [...authQueryKey.regionAll(), keyword] as const,
  regionLatLng: ({ lat, lng }: LatLng) =>
    [...authQueryKey.regionAll(), lat, lng] as const,
} as const;

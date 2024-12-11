export interface PetInfo {
  petId: number;
  name: string;
  breed: string;
  description: string | null;
  personalities: string[];
  profile: string | null;
}

export interface ProfileInfo {
  userId: number;
  nickname: string;
  socialType: "NAVER" | "GOOGLE" | "EMAIL" | null;
  followersIds: number[];
  followingsIds: number[];
  markings?: number[];

  // ROLE_USER 이상인 유저에게만 PetInfo 정보가 나타납니다.

  pet: PetInfo | null;

  // likes, bookmarks, tempCnt , markings는 본인의 페이지 일 때에만 나타납니다.

  likes?: number[];
  bookmarks?: number[];
  tempCnt?: number;
}

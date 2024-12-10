import { MARKING_VISIBILITY_MAP } from "../constants";

interface Address {
  id: number;
  province: string;
  cityCounty: string;
  district: string | null;
  subDistrict: string;
}

interface Pet {
  petId: number;
  name: string;
  description: string | null;
  profile: string | null;
  breed: string;
  personalities: string[];
}

export interface MarkingImage {
  id: number;
  imageUrl: string;
  lank: number;
  regDt: string;
}

export type IsVisible = keyof typeof MARKING_VISIBILITY_MAP;

export interface Marking {
  markingId: number;
  region: string;
  content: string | null;
  isVisible: IsVisible;
  regDt: string;
  previewImage: string;
  userId: number;
  nickName: string;
  isOwner: boolean;
  isTempSaved: boolean;
  lat: number;
  lng: number;
  address: Address;
  countData: {
    likedCount: number;
    savedCount: number;
  };
  pet: Pet;
  images: MarkingImage[];
}

export interface Marker {
  markingId: number;
  previewImage: string;
  lat: number;
  lng: number;
}

export interface TempMarking extends Omit<Marking, "previewImage"> {
  previewImage: string | null;
}

export type SortType = "RECENT" | "DISTANCE" | "POPULARITY";
export type SearchType = "NEARBY" | "LOCATION";

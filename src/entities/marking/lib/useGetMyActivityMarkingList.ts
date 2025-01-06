import { useGetMyLikedMarkingList, useGetMySavedMarkingList } from "../api";

export const useGetMyActivityMarkingList = (activeTab: "LIKED" | "SAVED") => {
  const likedMarkingListResult = useGetMyLikedMarkingList({
    enabled: activeTab === "LIKED",
  });
  const savedMarkingListResult = useGetMySavedMarkingList({
    enabled: activeTab === "SAVED",
  });

  if (activeTab === "LIKED") {
    return likedMarkingListResult;
  }

  return savedMarkingListResult;
};

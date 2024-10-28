import { useMutation } from "@tanstack/react-query";
import type {
  TempMarkingFileInfo,
  TempMarkingInfo,
} from "@/entities/marking/api";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

export interface PutModifyTempMarkingRequest
  extends Pick<TempMarkingInfo, "isVisible"> {
  content: NonNullable<TempMarkingInfo["content"]>;
  id: TempMarkingInfo["markingId"];
  removeIds: TempMarkingFileInfo["id"][];
  isTempSaved: boolean;
  images: File[];
}

export const usePutModifyTempMarking = () => {
  return useMutation<unknown, Error, PutModifyTempMarkingRequest>({
    mutationFn: ({ images, ...formObj }: PutModifyTempMarkingRequest) => {
      const formData = new FormData();
      formData.append("markingModifyDto", JSON.stringify(formObj));
      images.forEach((image) => {
        formData.append("images", image);
      });
      return apiClient.put(MARKING_END_POINT.PUT_MODIFY_TEMP_MARKING, {
        withToken: true,
        body: formData,
      });
    },
  });
};

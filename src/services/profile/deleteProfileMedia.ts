import axiosInstance from "@/lib/http";
import { AxiosResponse } from "axios";

export const deleteProfileMedia = async ({
  mediaType
}: {
  mediaType: "avatar" | "header";
}): Promise<Account> => {
  const endpoint = mediaType === "avatar" ? "profile/avatar" : "profile/header";
  const resp: AxiosResponse<Account> = await axiosInstance.delete(
    `/api/v1/${endpoint}`
  );
  return resp.data;
};

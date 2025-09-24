import http from "@/lib/http";
import { Status } from "@/types/status";
import { getMaxId } from "@/utils";
import { AxiosResponse } from "axios";

export const getBookmarkList = async (pageParam: string) => {
  try {

    const resp: AxiosResponse<Status[]> = await http.get(`/api/v1/bookmarks`, {
      params: {
        max_id: pageParam
      }
    });

    return {
      statuses: resp.data,
      nextMaxId: getMaxId(resp.headers["link"]),
    };
  } catch (error) {
    throw error;
  }
};

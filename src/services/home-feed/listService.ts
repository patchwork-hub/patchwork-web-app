import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/http";
import { handleError } from "@/utils/helper/helper";
export const listsService = async () => {
  try {
    const resp: AxiosResponse<Lists[]> = await axiosInstance.get(
      "/api/v1/lists"
    );
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};

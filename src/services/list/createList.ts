import axiosInstance from "@/lib/http";
import {
  CreateListPayload,
  CreateListResponse,
} from "@/types/queries/lists.type";

export const createList = async (
  payload: CreateListPayload
): Promise<CreateListResponse> => {
  const response = await axiosInstance.post("/api/v1/lists", payload);
  return response.data;
};

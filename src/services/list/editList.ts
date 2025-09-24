import axiosInstance from "@/lib/http";
import {
  CreateListPayload,
  CreateListResponse,
} from "@/types/queries/lists.type";

export const editList = async (
  payload: CreateListPayload,
  id: string | number
): Promise<CreateListResponse> => {
  const response = await axiosInstance.put(`/api/v1/lists/${id}`, payload);
  return response.data;
};

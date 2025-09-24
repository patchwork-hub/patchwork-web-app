import axiosInstance from "@/lib/http";
export const deleteList = async (listId: number | string) => {
  const response = await axiosInstance.delete(`/api/v1/lists/${listId}`);
  return response.data;
};

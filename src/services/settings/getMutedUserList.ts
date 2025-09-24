import axiosInstance from "@/lib/http";
import { MuteBlockUserAccount } from "@/types/profile";
import { getMaxId } from "@/utils";

export const getMutedUserList = async (max_id: string) => {
  const res = await axiosInstance.get<MuteBlockUserAccount[]>(
    `/api/v1/mutes`,
    {
      params: {
        max_id
      }
    }
  );
  return {
    data: res.data,
    max_id: getMaxId(res.headers["link"])
  };
};

export const getBlockedUserList = async (max_id: string) => {
  const res = await axiosInstance.get<MuteBlockUserAccount[]>(
    `/api/v1/blocks`,
    {
      params: {
        max_id
      }
    }
  );

  return {
    data: res.data,
    max_id: getMaxId(res.headers["link"])
  };
};

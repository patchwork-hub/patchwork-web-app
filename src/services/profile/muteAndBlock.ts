import http from "@/lib/http";
import { RelationShip } from "@/types/profile";
import { AxiosResponse } from "axios";

export const muteUnMuteUserMutationFn = async ({
  accountId,
  toMute
}: {
  accountId: string;
  toMute: boolean;
}) => {
  try {
    const muteAction = toMute ? "mute" : "unmute";
    const resp: AxiosResponse<RelationShip> = await http.post(
      `/api/v1/accounts/${accountId}/${muteAction}`,
      toMute && { duration: "0", notifications: true }
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const blockUnBlockUserMutationFn = async ({
  accountId,
  toBlock
}: {
  accountId: string;
  toBlock: boolean;
}) => {
  try {
    const blockAction = toBlock ? "block" : "unblock";
    const resp: AxiosResponse<RelationShip> = await http.post(
      `/api/v1/accounts/${accountId}/${blockAction}`
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};

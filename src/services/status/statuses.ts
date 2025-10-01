import type { StatusComposeFormData } from "@/components/organisms/compose/types";
import http from "@/lib/http";
import { Context, Status } from "@/types/status";

export type StatusActionParams = {
  id: string;
  url: string;
  differentOrigin: boolean;
};

export type CreatePostParams = {
  formData: StatusComposeFormData;
  url?: string;
  differentOrigin?: boolean;
};

export const createNewPost = async ({
  formData,
  url,
  differentOrigin,
}: CreatePostParams) => {
  const response = await http.post<Status>("/api/v1/statuses", formData, {
    params: {
      url,
      differentOrigin,
    },
  });
  return response.data;
};

export const favouriteStatus = async ({
  id,
  url,
  differentOrigin,
}: StatusActionParams) => {
  const response = await http.post(`/api/v1/statuses/${id}/favourite`, null, {
    params: {
      url,
      differentOrigin,
    },
  });
  return response.data;
};

export const unfavouriteStatus = async ({
  id,
  url,
  differentOrigin,
}: StatusActionParams) => {
  const response = await http.post(`/api/v1/statuses/${id}/unfavourite`, null, {
    params: {
      url,
      differentOrigin,
    },
  });
  return response.data;
};

export type BoostActionParams = {
  id: string;
  visibility: string;
  content: string;
  url: string;
  differentOrigin: boolean;
};

export const boostStatus = async ({
  id,
  visibility,
  content,
  url,
  differentOrigin,
}: BoostActionParams) => {
  const formData = new FormData();
  formData.append("visibility", visibility);
  formData.append("status", content);
  const response = await http.post(`/api/v1/statuses/${id}/reblog`, formData, {
    params: {
      url,
      differentOrigin,
    },
  });
  return response.data;
};

export const unboostStatus = async ({
  id,
  url,
  differentOrigin,
}: Omit<BoostActionParams, "content" | "visibility">) => {
  const response = await http.post(`/api/v1/statuses/${id}/unreblog`, null, {
    params: {
      url,
      differentOrigin,
    },
  });
  return response.data;
};

export const bookmarkStatus = async ({
  id,
  url,
  differentOrigin,
}: StatusActionParams) => {
  const response = await http.post(`/api/v1/statuses/${id}/bookmark`, null, {
    params: {
      url,
      differentOrigin,
    },
  });
  return response.data;
};

export const unbookmarkStatus = async ({
  id,
  url,
  differentOrigin,
}: StatusActionParams) => {
  const response = await http.post(`/api/v1/statuses/${id}/unbookmark`, null, {
    params: {
      url,
      differentOrigin,
    },
  });
  return response.data;
};

export const deleteStatus = async (
  id: string,
  deleteMedia: boolean = false
) => {
  const response = await http.delete(`/api/v1/statuses/${id}`, {
    params: {
      delete_media: deleteMedia,
    },
  });
  return response.data;
};

export const getStatus = async (id: string, domain?: string) => {
  const response = await http.get(`/api/v1/statuses/${id}`, {
    params: {
      domain_name: domain,
      isDynamicDomain: domain ? true : false,
    },
  });
  return response.data;
};

export const editStatus = async (
  id: string,
  formData: StatusComposeFormData
) => {
  const response = await http.put(`/api/v1/statuses/${id}`, formData);
  return response.data;
};

export const getContext = async (id: string, domain?: string) => {
  const response = await http.get<Context>(`/api/v1/statuses/${id}/context`, {
    params: {
      domain_name: domain,
      isDynamicDomain: domain ? true : false,
    },
  });
  return response.data;
};

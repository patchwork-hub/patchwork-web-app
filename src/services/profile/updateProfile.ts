import { UpdateProfilePayload } from "@/types/profile";
import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/http";
import { Account } from "@/types/account";

export const updateProfile = async (
  params: UpdateProfilePayload
): Promise<Account> => {
  try {
    const formData = new FormData();
    formData.append("display_name", params.display_name ?? "");
    formData.append("note", params.note ?? "");

    if (params.avatar && typeof params.avatar !== "string") {
      formData.append("avatar", params.avatar);
    }

    if (params.header && typeof params.header !== "string") {
      formData.append("header", params.header);
    }

    if (params.fields_attributes) {
      Object.values(params.fields_attributes).forEach((field, index) => {
        if (field.value.trim() === "") {
          formData.append(`fields_attributes[${index}][name]`, "");
          formData.append(`fields_attributes[${index}][value]`, "");
        } else {
          formData.append(`fields_attributes[${index}][name]`, field.name);
          formData.append(`fields_attributes[${index}][value]`, field.value);
        }
      });
    }

    const resp: AxiosResponse<Account> = await axiosInstance.patch(
      `/api/v1/accounts/update_credentials`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};

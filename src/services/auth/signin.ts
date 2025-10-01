import axiosInstance from "@/lib/http";
import { createSchemas } from "@/lib/schema/validations";
import z from "zod";

type SignInFormData = z.infer<ReturnType<typeof createSchemas>["SignInFormSchema"]>;
export const signIn = async ({ username, password }: SignInFormData) => {
  const body = {
    username,
    password,
    grant_type: "password",
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    scope: "read write follow push profile",
  };
  try {
    const { data } = await axiosInstance.post("/oauth/token", body);
    return data;
  } catch (error) {
    console.error("::=>", error);
    throw error;
  }
};

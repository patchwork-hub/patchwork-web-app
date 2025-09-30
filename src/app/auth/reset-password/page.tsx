import ResetPasswordPage from "@/components/pages/auth/ResetPassword";
import { NextPage } from "next";
import { use } from "react";

type ResetPasswordProps = {
  searchParams: Promise<{ resetToken: string; token: string }>;
}

const ResetPassword: NextPage<ResetPasswordProps> = ({ searchParams }) => {
  const { token, resetToken } = use(searchParams);
  return <ResetPasswordPage token={token} resetToken={resetToken} />;
};
export default ResetPassword;

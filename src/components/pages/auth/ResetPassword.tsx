import React from "react";
import ResetPasswordForm from "../../templates/auth/ResetPasswordForm";

interface ResetPasswordPageProps {
  token: string;
  resetToken: string;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  token,
  resetToken
}) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <ResetPasswordForm token={token} resetToken={resetToken} />
      </div>
    </div>
  );
};

export default ResetPasswordPage;

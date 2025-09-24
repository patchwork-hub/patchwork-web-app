import React from "react";
import ChangePasswordForm from "@/components/template/auth/ChangePasswordForm";
import Header from "@/components/atoms/common/Header";

const ChangePasswordPage: React.FC = () => {
  return (
    <div>
      <Header title="Change password" />
      <div className="w-full px-8 pt-12">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;

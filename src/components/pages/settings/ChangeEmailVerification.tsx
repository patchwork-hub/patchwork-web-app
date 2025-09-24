import React from "react";
import Header from "@/components/atoms/common/Header";
import ChangeEmailVerificationForm from "@/components/template/settings/ChangeEmailVerificationForm";

const ChangeEmailVerification: React.FC = () => {
  return (
    <div>
      <Header title="Email verification" />
      <div className="w-full px-8 pt-12">
        <ChangeEmailVerificationForm />
      </div>
    </div>
  );
};

export default ChangeEmailVerification;

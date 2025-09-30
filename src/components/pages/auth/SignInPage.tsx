"use client";
import SignInForm from "@/components/templates/auth/SignInForm";
import React from "react";

type SignInPageProps = {
  code: string;
}

const SignInPage: React.FC<SignInPageProps> = ({ code }) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignInForm code={code} />
      </div>
    </div>
  );
};

export default SignInPage;

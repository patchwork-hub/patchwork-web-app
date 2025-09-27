import SignInPage from "@/components/pages/auth/SignInPage";
import { NextPage } from "next";
import { use } from "react";

interface SignInPageProps {
  searchParams: Promise<{ code: string }>;
}

const SignIn: NextPage<SignInPageProps> = ({ searchParams }) => {
  const { code } = use(searchParams);
  return <SignInPage code={code} />;
};
export default SignIn;

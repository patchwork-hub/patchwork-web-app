import Home from "@/components/pages/home/Private";
import PublicHome from "@/components/pages/home/Public";
import { NextPage } from "next";
import { cookies } from "next/headers";
import React from "react";
const HomePage: NextPage = async () => {
  const token = (await cookies()).get("token")?.value;
  return token ? <Home /> : <PublicHome />;
};
export default HomePage;

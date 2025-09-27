import LayoutContainer from "@/components/templates/LayoutContainer";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return <LayoutContainer>{children}</LayoutContainer>;
};

export default Layout;

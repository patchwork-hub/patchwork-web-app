import LayoutContainer from "@/components/templates/LayoutContainer";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <LayoutContainer>{children}</LayoutContainer>;
};

export default Layout;
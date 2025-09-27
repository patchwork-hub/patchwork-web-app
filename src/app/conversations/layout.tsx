import LayoutContainer from '@/components/templates/LayoutContainer';
import { Metadata } from 'next';
import React, { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: "Conversations",
  description: "Conversations page",
};

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <LayoutContainer>
      {children}
    </LayoutContainer>
  );
};

export default Layout;

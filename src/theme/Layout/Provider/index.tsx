import React from 'react';
import { composeProviders } from '@docusaurus/theme-common';
import {
  ColorModeProvider,
  AnnouncementBarProvider,
  ScrollControllerProvider,
  NavbarProvider,
} from '@docusaurus/theme-common/internal';

const Provider = composeProviders([
  ColorModeProvider,
  AnnouncementBarProvider,
  ScrollControllerProvider,
  NavbarProvider,
]);

export default function LayoutProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <Provider>{children}</Provider>;
}

import React from 'react';
import clsx from 'clsx';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import {
  PageMetadata,
  SkipToContentFallbackId,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import ErrorPageContent from '@theme/ErrorPageContent';

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  wrapperClassName?: string;
  noFooter?: boolean;
}

/**
 * Persistent Shell Page Layout Component
 * In this persistent AST architecture, Navbar, Footer, and UniversalTranslatorBar
 * are held in memory permanently inside Root.tsx.
 * This Page Layout component strictly handles page-level metadata and wraps the
 * child content within the active AST viewport without tearing down the chrome.
 */
export default function Layout(props: LayoutProps): React.JSX.Element {
  const {
    children,
    wrapperClassName,
    title,
    description,
  } = props;

  return (
    <>
      <PageMetadata title={title} description={description} />
      <div
        id={SkipToContentFallbackId}
        className={clsx(
          ThemeClassNames.layout.main.container,
          ThemeClassNames.wrapper.main,
          wrapperClassName,
        )}
        style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}
      >
        <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
          {children}
        </ErrorBoundary>
      </div>
    </>
  );
}

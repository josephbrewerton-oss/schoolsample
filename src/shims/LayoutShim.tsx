import React, { useEffect } from 'react';

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  wrapperClassName?: string;
  noFooter?: boolean;
}

export default function Layout({ children, title, description }: LayoutProps): React.JSX.Element {
  useEffect(() => {
    if (title) {
      document.title = `${title} | St Joseph's Curriculum Portal`;
    }
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', description);
      }
    }
  }, [title, description]);

  return <>{children}</>;
}

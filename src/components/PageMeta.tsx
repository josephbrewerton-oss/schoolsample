import React, { useEffect } from 'react';

export interface PageMetaProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * Standard client-side React component to set document title and meta description,
 * replacing the previous @theme/Layout shim.
 */
export default function PageMeta({ title, description, children }: PageMetaProps): React.JSX.Element {
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

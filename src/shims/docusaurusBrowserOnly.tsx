import React from 'react';

export default function BrowserOnly({
  children,
  fallback = null,
}: {
  children: () => React.ReactNode;
  fallback?: React.ReactNode;
}): React.JSX.Element | null {
  if (typeof window === 'undefined') {
    return fallback ? <>{fallback}</> : null;
  }
  return <>{children()}</>;
}

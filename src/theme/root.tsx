import React, { useEffect } from 'react';

export default function Root({ children }: { children: React.ReactNode }): React.JSX.Element {
  useEffect(() => {
    const storedFont = localStorage.getItem("app_font_size") || "normal";
    const storedContrast = localStorage.getItem("app_high_contrast") === "true";

    document.documentElement.setAttribute("data-font-size", storedFont);
    document.documentElement.classList.toggle("high-contrast-mode", storedContrast);
  }, []);

  return <>{children}</>;
}
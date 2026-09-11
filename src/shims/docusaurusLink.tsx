import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

export interface LinkProps extends Omit<RouterLinkProps, 'to'> {
  to?: string;
  href?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  target?: string;
  rel?: string;
}

export const Link: React.FC<LinkProps> = ({ to, href, children, ...rest }) => {
  const targetPath = to || href || '#';
  const isExternal = targetPath.startsWith('http://') || targetPath.startsWith('https://') || targetPath.startsWith('mailto:');

  if (isExternal) {
    return (
      <a href={targetPath} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={targetPath} {...rest}>
      {children}
    </RouterLink>
  );
};

export default Link;

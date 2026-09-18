// src/router/index.tsx
/**
 * In-House Zero-Dependency Client Router
 * 
 * Provides:
 * - BrowserRouter
 * - Routes, Route, Outlet (with nested route support)
 * - Link, NavLink
 * - useLocation, useNavigate, useSearchParams
 * 
 * Replaces react-router-dom, eliminating external runtime routing dependencies.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
  type CSSProperties,
  type MouseEvent,
} from 'react';

export interface LocationState {
  pathname: string;
  search: string;
  hash: string;
  state: any;
}

export type NavigateFunction = (
  to: string | number,
  options?: { replace?: boolean; state?: any }
) => void;

interface RouterContextValue {
  location: LocationState;
  navigate: NavigateFunction;
  basename: string;
}

const RouterContext = createContext<RouterContextValue | null>(null);
const OutletContext = createContext<ReactNode | null>(null);

function getBrowserLocation(): LocationState {
  if (typeof window === 'undefined') {
    return { pathname: '/', search: '', hash: '', state: null };
  }
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: window.history.state,
  };
}

export interface BrowserRouterProps {
  children: ReactNode;
  basename?: string;
}

export function BrowserRouter({ children, basename = '/' }: BrowserRouterProps): React.JSX.Element {
  const normalizedBasename = useMemo(() => {
    let b = basename.trim();
    if (!b.startsWith('/')) b = '/' + b;
    if (b !== '/' && b.endsWith('/')) b = b.slice(0, -1);
    return b;
  }, [basename]);

  const [location, setLocation] = useState<LocationState>(getBrowserLocation);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        state: e.state,
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate: NavigateFunction = useCallback(
    (to, options) => {
      if (typeof to === 'number') {
        window.history.go(to);
        return;
      }

      let targetUrl = to.trim();

      // If relative path and basename is configured
      if (normalizedBasename !== '/' && targetUrl.startsWith('/')) {
        if (!targetUrl.startsWith(normalizedBasename)) {
          targetUrl = `${normalizedBasename}${targetUrl}`;
        }
      }

      if (options?.replace) {
        window.history.replaceState(options.state ?? null, '', targetUrl);
      } else {
        window.history.pushState(options?.state ?? null, '', targetUrl);
      }

      setLocation(getBrowserLocation());
    },
    [normalizedBasename]
  );

  const contextValue = useMemo<RouterContextValue>(
    () => ({
      location,
      navigate,
      basename: normalizedBasename,
    }),
    [location, navigate, normalizedBasename]
  );

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
}

export function useLocation(): LocationState {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    return getBrowserLocation();
  }
  return ctx.location;
}

export function useNavigate(): NavigateFunction {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    return (to, options) => {
      if (typeof to === 'number') {
        window.history.go(to);
      } else if (options?.replace) {
        window.location.replace(to);
      } else {
        window.location.assign(to);
      }
    };
  }
  return ctx.navigate;
}

export function useSearchParams(): [
  URLSearchParams,
  (newParams: URLSearchParams | Record<string, string>, options?: { replace?: boolean }) => void
] {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const setSearchParams = useCallback(
    (newParams: URLSearchParams | Record<string, string>, options?: { replace?: boolean }) => {
      const sp = newParams instanceof URLSearchParams ? newParams : new URLSearchParams(newParams);
      const queryString = sp.toString();
      const newUrl = `${location.pathname}${queryString ? `?${queryString}` : ''}${location.hash}`;
      navigate(newUrl, { replace: options?.replace ?? true });
    },
    [location.pathname, location.hash, navigate]
  );

  return [searchParams, setSearchParams];
}

export interface RouteProps {
  path?: string;
  index?: boolean;
  element?: ReactNode;
  children?: ReactNode;
}

export function Route(_props: RouteProps): React.JSX.Element | null {
  return null;
}

export interface RoutesProps {
  children: ReactNode;
}

function normalizePath(p: string): string {
  if (!p) return '/';
  let s = p.trim();
  if (!s.startsWith('/')) s = '/' + s;
  if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
  return s;
}

function matchSubRoute(
  pattern: string,
  pathname: string
): boolean {
  if (pattern === '*') return true;
  if (pattern.endsWith('/*')) {
    const prefix = normalizePath(pattern.slice(0, -2));
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  }
  const normPattern = normalizePath(pattern);
  return pathname === normPattern;
}

export function Routes({ children }: RoutesProps): React.JSX.Element | null {
  const location = useLocation();
  const ctx = useContext(RouterContext);
  const basename = ctx?.basename || '/';

  // Strip basename if present
  let currentPath = location.pathname;
  if (basename !== '/' && currentPath.startsWith(basename)) {
    currentPath = currentPath.slice(basename.length) || '/';
  }
  currentPath = normalizePath(currentPath);

  const routeList = React.Children.toArray(children).filter(Boolean) as React.ReactElement<RouteProps>[];

  for (const route of routeList) {
    const { path = '/', element, children: subChildren } = route.props;

    // Check if this is a wrapper route like <Route path="/" element={<PersistentAppShell />}>
    if (subChildren) {
      const childRoutes = React.Children.toArray(subChildren).filter(Boolean) as React.ReactElement<RouteProps>[];

      let matchedChild: ReactNode = null;
      let wildcardChild: ReactNode = null;

      for (const child of childRoutes) {
        const cProps = child.props;
        if (cProps.index && currentPath === '/') {
          matchedChild = cProps.element;
          break;
        }
        if (cProps.path) {
          if (cProps.path === '*') {
            wildcardChild = cProps.element;
            continue;
          }
          if (matchSubRoute(cProps.path, currentPath)) {
            matchedChild = cProps.element;
            break;
          }
        }
      }

      const activeChild = matchedChild ?? wildcardChild;
      if (activeChild !== null) {
        return (
          <OutletContext.Provider value={activeChild}>
            {element || activeChild}
          </OutletContext.Provider>
        );
      }
    } else {
      // Direct non-nested route
      if (route.props.index && currentPath === '/') {
        return <>{element}</>;
      }
      if (path && matchSubRoute(path, currentPath)) {
        return <>{element}</>;
      }
    }
  }

  return null;
}

export function Outlet(): React.JSX.Element | null {
  const child = useContext(OutletContext);
  return <>{child}</>;
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
  state?: any;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, replace = false, state, onClick, children, ...rest },
  ref
) {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);

    // Let browser handle special clicks (Cmd+click, Ctrl+click, middle click, etc.)
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey ||
      (rest.target && rest.target !== '_self')
    ) {
      return;
    }

    // External link check
    if (to.startsWith('http://') || to.startsWith('https://') || to.startsWith('mailto:') || to.startsWith('tel:')) {
      return;
    }

    e.preventDefault();
    navigate(to, { replace, state });
  };

  return (
    <a ref={ref} href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
});

export interface NavLinkProps extends Omit<LinkProps, 'className' | 'style'> {
  className?: string | ((props: { isActive: boolean; isPending?: boolean }) => string);
  style?: CSSProperties | ((props: { isActive: boolean; isPending?: boolean }) => CSSProperties);
  end?: boolean;
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, className, style, end = false, ...rest },
  ref
) {
  const location = useLocation();
  const ctx = useContext(RouterContext);
  const basename = ctx?.basename || '/';

  let currentPath = location.pathname;
  if (basename !== '/' && currentPath.startsWith(basename)) {
    currentPath = currentPath.slice(basename.length) || '/';
  }
  currentPath = normalizePath(currentPath);

  const targetPath = normalizePath(to.split('?')[0].split('#')[0]);

  const isActive = end
    ? currentPath === targetPath
    : targetPath === '/'
    ? currentPath === '/'
    : currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);

  const computedClassName = typeof className === 'function' ? className({ isActive, isPending: false }) : className;
  const computedStyle = typeof style === 'function' ? style({ isActive, isPending: false }) : style;

  return (
    <Link
      ref={ref}
      to={to}
      className={computedClassName}
      style={computedStyle}
      {...rest}
    />
  );
});

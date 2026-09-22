import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouteState {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

interface NavigationContextType {
  currentPath: string;
  params: Record<string, string>;
  query: Record<string, string>;
  navigate: (path: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

function parsePath(url: string): RouteState {
  const [pathname, searchStr] = url.split('?');
  const searchParams = new URLSearchParams(searchStr || '');
  const query: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    query[key] = val;
  });

  const params: Record<string, string> = {};
  const segments = pathname.split('/').filter(Boolean);

  // Route matching
  if (segments[0] === 'produto' && segments[1]) {
    params.slug = segments[1];
  } else if (segments[0] === 'categoria' && segments[1]) {
    params.category = segments[1];
  } else if (segments[0] === 'blog' && segments[1]) {
    params.articleSlug = segments[1];
  }

  return {
    path: pathname || '/',
    params,
    query,
  };
}

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routeState, setRouteState] = useState<RouteState>(() =>
    parsePath(window.location.pathname + window.location.search)
  );
  const [searchQuery, setSearchQuery] = useState(routeState.query.q || '');

  useEffect(() => {
    const onPopState = () => {
      const parsed = parsePath(window.location.pathname + window.location.search);
      setRouteState(parsed);
      if (parsed.query.q !== undefined) {
        setSearchQuery(parsed.query.q);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (newPath: string) => {
    if (newPath === routeState.path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState({}, '', newPath);
    const parsed = parsePath(newPath);
    setRouteState(parsed);
    if (parsed.query.q !== undefined) {
      setSearchQuery(parsed.query.q);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPath: routeState.path,
        params: routeState.params,
        query: routeState.query,
        navigate,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return ctx;
};

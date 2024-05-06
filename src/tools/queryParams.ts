import { isBrowser } from './env';

const SSRQueryParams = {};

export function parseQueryParams(qs?: string): Record<string, string> {
  const queryString = qs || isBrowser ? location?.search : '';

  if (!queryString) return {};

  return [...new URLSearchParams(queryString).entries()].reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );
}

export function stringifyQueryParams(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

export function applyQueryParams(path, queryParams, currParams) {
  const clearPath = path.replace(/\?.*/, '/');

  if (!queryParams) {
    if (Object.keys(currParams).length === 0) return path;
    return `${clearPath}?${stringifyQueryParams(currParams)}`;
  }

  if (typeof queryParams === 'string') {
    return queryParams;
  }

  const query = { ...currParams };

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === false) delete query[key];
    else query[key] = value;
  });

  if (Object.keys(query).length === 0) return clearPath;

  return `${clearPath}?${stringifyQueryParams(query)}`;
}

export const setSSRQueryParams = (params): void => {
  Object.assign(SSRQueryParams, params);
};

export const queryParams: Record<string, string> = isBrowser
  ? parseQueryParams()
  : SSRQueryParams;

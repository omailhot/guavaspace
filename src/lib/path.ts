export const getFullS3Path = (path: string) => {
  return import.meta.env.VITE_S3_PATH + '/' + path;
};

export const getFullApiPath = (path: string, queryParams?: URLSearchParams) => {
  return (
    import.meta.env.VITE_API_PATH +
    path +
    (queryParams ? `?${queryParams.toString()}` : '')
  );
};

export const convertObjectToQueryString = (obj: Record<string, any>) => {
  return Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join('&');
};

export const formatDateToQueryParams = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const routeFilter = (params: any) => {
  return new URLSearchParams(params);
};

export const sanitizeInput = (input: string) =>
  input.replace(/<\/?[^>]+(>|$)/g, "");

export const getMaxId = (linkHeader?: string) => {
  if (!linkHeader) return null;
  const nextLink = linkHeader.match(/<([^>]+)>;\s*rel="next"/)?.[1];
  return nextLink ? new URL(nextLink).searchParams.get("max_id") : null;
};

export const checkSupportsNotiV2 = (version: string): boolean => {
  const [major, minor] = version.split(".")?.map(Number);
  return major > 4 || (major === 4 && minor >= 3);
};

export const isValidImageUrl = (url: string): boolean => {
  return !!(
    url &&
    url !== "/avatar_images/original/missing.png" &&
    url.startsWith("http")
  );
};

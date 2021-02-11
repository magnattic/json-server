const handleError = (e: Error, url: string) => {
  if (e.name === 'AbortError') {
    throw new Error(`Request timeout for ${url}`);
  } else {
    throw e.message;
  }
};

export const fetchWithTimeout = (
  url: string,
  { signal, ms, ...options }: RequestInit & { ms?: number } = { ms: 5000 }
) => {
  const controller = new AbortController();

  const promise = fetch(url, { signal: controller.signal, ...options });

  if (signal) signal.addEventListener('abort', () => controller.abort());

  const timeout = setTimeout(() => controller.abort(), ms);

  return promise
    .then(
      (r) => r,
      (e) => handleError(e, url)
    )
    .finally(() => clearTimeout(timeout));
};

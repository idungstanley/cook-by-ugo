const MOCK_LATENCY_MS = 250

/**
 * Stands in for the Appwrite SDK. Services call this so that swapping in real requests only
 * touches the `*.api.ts` files, and components and query hooks stay the same.
 */
export const mockRequest = <T>(data: T, latency = MOCK_LATENCY_MS): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), latency))

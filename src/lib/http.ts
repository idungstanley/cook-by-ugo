import { accountToken } from './accountToken'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

/** Sends the customer's account token when they are signed in, so orders join their history. */
const request = async <T>(path: string, init: RequestInit = {}, base = '/api/public') => {
  const token = accountToken.get()
  const response = await fetch(`${API_URL}${base}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })
  if (!response.ok) {
    const { message } = (await response.json().catch(() => ({}))) as { message?: string }
    throw new HttpError(response.status, message ?? 'Something went wrong. Please try again.')
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

const client = (base: string) => ({
  get: <T>(path: string) => request<T>(path, {}, base),
  post: <T>(path: string, body?: unknown) =>
    request<T>(
      path,
      { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) },
      base,
    ),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, base),
})

export const http = client('/api/public')
export const accountHttp = client('/api/account')

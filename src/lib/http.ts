const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

const request = async <T>(path: string, init?: RequestInit) => {
  const response = await fetch(`${API_URL}/api/public${path}`, init)
  if (!response.ok) {
    const { message } = (await response.json().catch(() => ({}))) as { message?: string }
    throw new Error(message ?? 'Something went wrong. Please try again.')
  }
  return (await response.json()) as T
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
}

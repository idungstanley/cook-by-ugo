const KEY = 'cbu-account'

/** Storage can be blocked in private browsing, so failures fall back to being signed out. */
export const accountToken = {
  get: () => {
    try {
      return localStorage.getItem(KEY)
    } catch {
      return null
    }
  },
  set: (token: string) => {
    try {
      localStorage.setItem(KEY, token)
    } catch {
      // Signed in for this visit only.
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(KEY)
    } catch {
      // Nothing stored.
    }
  },
}

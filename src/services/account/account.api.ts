import { accountHttp } from '@/lib/http'
import type { Account, AccountOrder, AccountSession, SavedAddress } from '@/types'

export interface SignUpInput {
  name: string
  email: string
  password: string
  marketingOptIn: boolean
}

export interface ProfileInput {
  name: string
  phone?: string
  address?: SavedAddress
}

export const accountApi = {
  signUp: (input: SignUpInput) => accountHttp.post<AccountSession>('/signup', input),
  signIn: (input: { email: string; password: string }) =>
    accountHttp.post<AccountSession>('/login', input),
  signOut: () => accountHttp.post<void>('/logout'),
  getMe: () => accountHttp.get<Account>('/me'),
  updateMe: (input: ProfileInput) => accountHttp.patch<Account>('/me', input),
  getOrders: () => accountHttp.get<AccountOrder[]>('/orders'),
  forgotPassword: (email: string) => accountHttp.post<{ ok: true }>('/forgot-password', { email }),
  resetPassword: (input: { token: string; password: string }) =>
    accountHttp.post<AccountSession>('/reset-password', input),
}

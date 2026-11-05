import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { accountToken } from '@/lib/accountToken'
import { HttpError } from '@/lib/http'
import type { AccountSession } from '@/types'
import { accountApi } from './account.api'

/** The signed-in customer, or null for guests. A revoked or expired token signs them out. */
export const useAccount = () =>
  useQuery({
    queryKey: queryKeys.account,
    queryFn: async () => {
      if (!accountToken.get()) return null
      try {
        return await accountApi.getMe()
      } catch (error) {
        if (error instanceof HttpError && error.status === 401) {
          accountToken.clear()
          return null
        }
        throw error
      }
    },
    staleTime: 5 * 60_000,
    retry: false,
  })

const useStartSession = () => {
  const queryClient = useQueryClient()
  return ({ account, token }: AccountSession) => {
    accountToken.set(token)
    queryClient.setQueryData(queryKeys.account, account)
    void queryClient.invalidateQueries({ queryKey: queryKeys.accountOrders })
  }
}

export const useSignIn = () =>
  useMutation({ mutationFn: accountApi.signIn, onSuccess: useStartSession() })

export const useSignUp = () =>
  useMutation({ mutationFn: accountApi.signUp, onSuccess: useStartSession() })

export const useResetPassword = () =>
  useMutation({ mutationFn: accountApi.resetPassword, onSuccess: useStartSession() })

export const useForgotPassword = () => useMutation({ mutationFn: accountApi.forgotPassword })

export const useSignOut = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => accountApi.signOut().catch(() => undefined),
    onSettled: () => {
      accountToken.clear()
      queryClient.setQueryData(queryKeys.account, null)
      queryClient.removeQueries({ queryKey: queryKeys.accountOrders })
    },
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApi.updateMe,
    onSuccess: (account) => queryClient.setQueryData(queryKeys.account, account),
  })
}

export const useAccountOrders = (enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.accountOrders,
    queryFn: accountApi.getOrders,
    enabled,
    staleTime: 30_000,
  })

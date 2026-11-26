import { createFileRoute } from '@tanstack/react-router'
import { VerifyEmailPage } from '@/features/account/VerifyEmailPage'

const VerifyRoute = () => <VerifyEmailPage token={Route.useSearch().token} />

export const Route = createFileRoute('/account/verify-email')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  head: () => ({ meta: [{ title: 'Confirm your email · Cooked by Ugo' }] }),
  component: VerifyRoute,
})

import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordPage } from '@/features/account/ResetPasswordPage'

const ResetRoute = () => <ResetPasswordPage token={Route.useSearch().token} />

export const Route = createFileRoute('/account/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  head: () => ({ meta: [{ title: 'New password · Cooked by Ugo' }] }),
  component: ResetRoute,
})

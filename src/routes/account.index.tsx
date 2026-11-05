import { createFileRoute } from '@tanstack/react-router'
import { AccountPage } from '@/features/account/AccountPage'

export const Route = createFileRoute('/account/')({
  head: () => ({ meta: [{ title: 'Your account · Cooked by Ugo' }] }),
  component: AccountPage,
})

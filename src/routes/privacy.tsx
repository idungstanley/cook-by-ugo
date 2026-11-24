import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPage } from '@/features/info/PrivacyPage'

export const Route = createFileRoute('/privacy')({
  head: () => ({ meta: [{ title: 'Privacy · Cooked by Ugo' }] }),
  component: PrivacyPage,
})

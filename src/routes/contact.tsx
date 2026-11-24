import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '@/features/info/ContactPage'

export const Route = createFileRoute('/contact')({
  head: () => ({ meta: [{ title: 'Contact · Cooked by Ugo' }] }),
  component: ContactPage,
})

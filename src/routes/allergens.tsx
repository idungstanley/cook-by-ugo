import { createFileRoute } from '@tanstack/react-router'
import { AllergensPage } from '@/features/info/AllergensPage'
import { dishesQuery } from '@/services/menu/menu.queries'

export const Route = createFileRoute('/allergens')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(dishesQuery),
  head: () => ({ meta: [{ title: 'Allergens · Cooked by Ugo' }] }),
  component: AllergensPage,
})

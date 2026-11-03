import '@fontsource-variable/bricolage-grotesque/standard.css'
import '@fontsource-variable/fraunces/wght-italic.css'
import '@fontsource-variable/manrope/wght.css'
import './styles/globals.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { MotionConfig } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { queryClient } from '@/lib/queryClient'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Visitors who ask for reduced motion get fades without movement. */}
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </QueryClientProvider>
  </StrictMode>,
)

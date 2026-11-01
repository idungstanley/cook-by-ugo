import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, HeadContent, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { CompactFooter } from '@/components/layout/CompactFooter'
import { Header } from '@/components/layout/Header'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { buttonStyles } from '@/components/ui/button.styles'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { CheckoutDrawer } from '@/features/checkout/components/CheckoutDrawer'
import { DishModal } from '@/features/menu/components/DishModal'
import { siteInfoQuery } from '@/services/site/site.queries'

const RootLayout = () => (
  <>
    <HeadContent />
    <Header />
    <main>
      <Outlet />
    </main>
    <DishModal />
    <CartDrawer />
    <CheckoutDrawer />
    <MobileMenu />
    {import.meta.env.DEV && (
      <>
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <TanStackRouterDevtools position="bottom-right" />
      </>
    )}
  </>
)

const NotFound = () => (
  <>
    <StatusMessage
      title="This plate is empty"
      body="We could not find that page."
      action={
        <Link to="/menu" className={buttonStyles()}>
          See the menu
        </Link>
      }
    />
    <CompactFooter />
  </>
)

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: ({ context }) => context.queryClient.ensureQueryData(siteInfoQuery),
  head: () => ({ meta: [{ title: 'Cook by Ugo · Lagos flavour, Newcastle doorstep' }] }),
  component: RootLayout,
  notFoundComponent: NotFound,
})

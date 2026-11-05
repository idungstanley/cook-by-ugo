import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Overlay'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { useCartTotals } from '@/hooks/useCartTotals'
import { formatPrice } from '@/lib/format'
import { useCartStore } from '@/stores/cart.store'
import { useCheckoutStore } from '@/stores/checkout.store'
import { useUiStore } from '@/stores/ui.store'
import { CartLine } from './CartLine'
import { CartTotalsSummary, FreeDeliveryBar } from './CartTotalsSummary'
import { CartUpsell } from './CartUpsell'
import { PanelHeader } from './PanelHeader'

export const CartDrawer = () => {
  const open = useUiStore((state) => state.panel === 'cart')
  const closePanel = useUiStore((state) => state.closePanel)
  const openPanel = useUiStore((state) => state.openPanel)
  const resetCheckout = useCheckoutStore((state) => state.reset)
  const items = useCartStore((state) => state.items)
  const totals = useCartTotals()

  const startCheckout = () => {
    resetCheckout()
    openPanel('checkout')
  }

  return (
    <Drawer open={open} onClose={closePanel} label="Your order">
      <PanelHeader title="Your order" onClose={closePanel} />

      {items.length === 0 ? (
        <StatusMessage
          title="Nothing in the pot yet"
          body="Add a dish from the menu and it will show up here."
          action={<Button onClick={closePanel}>Keep browsing</Button>}
        />
      ) : (
        <>
          <ul className="px-5 sm:px-8">
            {items.map((item) => (
              <CartLine key={item.id} item={item} />
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-5 px-5 pb-6 pt-4 sm:px-8">
            <CartUpsell />
            <FreeDeliveryBar totals={totals} />
            <CartTotalsSummary totals={totals} appliedOffers={totals.appliedOffers} />
            <div className="flex flex-col items-center gap-2">
              <Button size="lg" fullWidth onClick={startCheckout}>
                Checkout · {formatPrice(totals.total)} →
              </Button>
              <Button variant="ghost" onClick={closePanel}>
                Keep browsing
              </Button>
            </div>
          </div>
        </>
      )}
    </Drawer>
  )
}

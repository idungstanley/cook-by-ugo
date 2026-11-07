import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { FoodImage } from '@/components/ui/FoodImage'
import { StripePayment } from '@/features/checkout/components/StripePayment'
import { formatPrice } from '@/lib/format'
import { useDishes } from '@/services/menu/menu.queries'
import { useRespondToChanges } from '@/services/orders/orders.queries'
import { useSiteInfo } from '@/services/site/site.queries'
import { useReplacementStore } from '@/stores/replacement.store'
import { useUiStore } from '@/stores/ui.store'
import type { TrackedOrder } from '@/types'

interface ChangesPanelProps {
  order: TrackedOrder
  trackingKey: string
}

type Mode = 'choose' | 'swap' | 'confirm-cancel'

const lineCost = ({ unitPrice, quantity }: { unitPrice: number; quantity: number }) =>
  unitPrice * quantity

/** Picks dishes to swap in, using the normal dish pop-up for options and notes. */
const SwapPicker = ({ unavailableCost }: { unavailableCost: number }) => {
  const { data: dishes = [] } = useDishes()
  const openDish = useUiStore((state) => state.openDish)
  const items = useReplacementStore((state) => state.items)
  const setQuantity = useReplacementStore((state) => state.setQuantity)
  const chosenCost = items.reduce((sum, item) => sum + lineCost(item), 0)
  const difference = chosenCost - unavailableCost

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Pick anything from the menu. It comes with the rest of your order, and you will not pay for
        delivery again.
      </p>

      <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto rounded-2xl bg-paper p-2">
        {dishes
          .filter(({ soldOut }) => !soldOut)
          .map((dish) => (
            <li key={dish.id} className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-shea">
              <FoodImage src={dish.image} alt="" className="size-11 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{dish.name}</p>
                <p className="text-xs text-muted">{formatPrice(dish.price)}</p>
              </div>
              <Button variant="dark" size="sm" onClick={() => openDish(dish.id)}>
                Add
              </Button>
            </li>
          ))}
      </ul>

      {items.length > 0 && (
        <div className="rounded-2xl bg-paper p-3">
          <p className="mb-2 text-sm font-bold">Your replacements</p>
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-2 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{item.name}</p>
                  {item.options.length > 0 && (
                    <p className="text-xs text-muted">
                      {item.options.map(({ label }) => label).join(' · ')}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label={`One less ${item.name}`}
                  onClick={() => setQuantity(item.id, item.quantity - 1)}
                  className="grid size-7 place-items-center rounded-full bg-shea"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-5 text-center font-semibold">{item.quantity}</span>
                <button
                  type="button"
                  aria-label={`One more ${item.name}`}
                  onClick={() => setQuantity(item.id, item.quantity + 1)}
                  className="grid size-7 place-items-center rounded-full bg-shea"
                >
                  <Plus className="size-3.5" />
                </button>
                <span className="w-16 text-right">{formatPrice(lineCost(item))}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-line pt-2 text-sm font-semibold">
            {difference > 0
              ? `You pay about ${formatPrice(difference)} more`
              : difference < 0
                ? `We refund about ${formatPrice(-difference)}`
                : 'Same price as before'}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Shown when the kitchen has run out of something on this order. The customer removes it for
 * a refund, swaps it for other dishes, or cancels, all without paying delivery twice.
 */
export const ChangesPanel = ({ order, trackingKey }: ChangesPanelProps) => {
  const respond = useRespondToChanges()
  const { data: site } = useSiteInfo()
  const replacements = useReplacementStore((state) => state.items)
  const startSwap = useReplacementStore((state) => state.start)
  const stopSwap = useReplacementStore((state) => state.stop)
  const [mode, setMode] = useState<Mode>('choose')
  const [paid, setPaid] = useState(false)
  const amendment = order.amendment

  // Leaving the page always puts the dish pop-up back to adding to the basket.
  useEffect(() => stopSwap, [stopSwap])

  if (!amendment || amendment.state === 'resolved') return null

  const unavailable = order.items.filter(({ id }) => amendment.unavailableItemIds.includes(id))
  const unavailableCost = unavailable.reduce((sum, item) => sum + lineCost(item), 0)
  const topUp = amendment.topUp
  const send = (response: Parameters<typeof respond.mutate>[0]['response']) =>
    respond.mutate({ orderId: order.id, trackingKey, response })

  const chooseSwap = () => {
    startSwap(order.id)
    setMode('swap')
  }
  const backToChoices = () => {
    stopSwap()
    setMode('choose')
  }

  return (
    <section id="update" className="flex scroll-mt-24 flex-col gap-4 rounded-card bg-gold-soft p-5">
      <div>
        <h2 className="text-2xl">Sorry, we have run out</h2>
        <p className="text-sm text-muted">
          Choose what you would like. We start cooking as soon as you do.
        </p>
      </div>

      {amendment.message && (
        <p className="rounded-2xl bg-paper px-4 py-3 text-sm">“{amendment.message}”</p>
      )}

      <ul className="flex flex-col gap-1 rounded-2xl bg-paper px-4 py-3 text-sm">
        {unavailable.map((item) => (
          <li key={item.id} className="flex justify-between gap-3">
            <span className="font-semibold">
              {item.quantity} × {item.name}
            </span>
            <span className="text-muted line-through">{formatPrice(lineCost(item))}</span>
          </li>
        ))}
      </ul>

      {amendment.state === 'awaiting-payment' &&
      topUp?.clientSecret &&
      site?.stripePublishableKey ? (
        paid ? (
          <p role="status" className="text-sm font-semibold">
            Payment received. Your order updates in a moment.
          </p>
        ) : (
          <>
            <p className="text-sm">
              Your replacements cost {formatPrice(topUp.extra)} more. Pay the difference to confirm,
              or choose again below.
            </p>
            <StripePayment
              publishableKey={site.stripePublishableKey}
              clientSecret={topUp.clientSecret}
              amount={topUp.extra}
              returnUrl={window.location.href}
              onPaid={() => setPaid(true)}
            />
          </>
        )
      ) : null}

      {mode === 'swap' && (
        // What the missing items were really worth after offers, so the estimate matches the refund.
        <SwapPicker unavailableCost={amendment.removalRefund ?? unavailableCost} />
      )}

      {respond.error && (
        <p role="alert" className="text-sm font-semibold text-jollof">
          {respond.error.message}
        </p>
      )}

      {mode === 'choose' && !paid && (
        <div className="grid gap-2 sm:grid-cols-3">
          <Button disabled={respond.isPending} onClick={() => send({ action: 'remove' })}>
            Remove {unavailable.length === 1 ? 'it' : 'them'}
          </Button>
          <Button variant="dark" disabled={respond.isPending} onClick={chooseSwap}>
            Swap for something else
          </Button>
          <Button
            variant="outline"
            disabled={respond.isPending}
            onClick={() => setMode('confirm-cancel')}
          >
            Cancel my order
          </Button>
          {amendment.removalRefund !== null && (
            <p className="text-xs text-muted sm:col-span-3">
              Removing {unavailable.length === 1 ? 'it' : 'them'} refunds{' '}
              {formatPrice(amendment.removalRefund)} to your card. Delivery is not charged again if
              you swap.
            </p>
          )}
        </div>
      )}

      {mode === 'swap' && (
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={replacements.length === 0 || respond.isPending}
            onClick={() =>
              send({
                action: 'replace',
                items: replacements.map(({ productId, quantity, selection, note }) => ({
                  productId,
                  quantity,
                  selection,
                  note,
                })),
              })
            }
          >
            {respond.isPending ? 'Updating...' : 'Confirm swap'}
          </Button>
          <Button variant="ghost" onClick={backToChoices}>
            Back
          </Button>
        </div>
      )}

      {mode === 'confirm-cancel' && (
        <div className="flex flex-col gap-2 rounded-2xl bg-paper p-4">
          <p className="text-sm font-semibold">
            Cancel the whole order? Everything you paid goes back to your card.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button disabled={respond.isPending} onClick={() => send({ action: 'cancel' })}>
              Yes, cancel it
            </Button>
            <Button variant="ghost" onClick={() => setMode('choose')}>
              Keep my order
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

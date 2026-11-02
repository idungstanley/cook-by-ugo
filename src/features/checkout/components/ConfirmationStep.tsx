import { useNavigate } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { Starburst } from '@/components/brand/Starburst'
import { Button } from '@/components/ui/Button'
import { buttonStyles } from '@/components/ui/button.styles'
import { buildWhatsappUrl } from '@/lib/whatsapp'
import { useOrder } from '@/services/orders/orders.queries'
import { useSiteInfo } from '@/services/site/site.queries'
import type { Order } from '@/types'
import { OrderTracker } from './OrderTracker'

interface ConfirmationStepProps {
  order: Order
  onDone: () => void
}

export const ConfirmationStep = ({ order, onDone }: ConfirmationStepProps) => {
  const navigate = useNavigate()
  const { data: liveOrder } = useOrder(order.id, order.trackingKey)
  const { data: site } = useSiteInfo()
  const status = liveOrder?.status ?? order.status

  const backToMenu = () => {
    onDone()
    void navigate({ to: '/menu' })
  }

  return (
    <div className="flex flex-1 flex-col gap-5 px-5 pb-6 pt-2 sm:px-8">
      <div className="flex flex-col items-center text-center">
        <Starburst points={16} className="size-24 text-ewedu">
          <Check className="size-10 text-paper" strokeWidth={3.5} />
        </Starburst>
        <h2 className="mt-3 text-3xl">Order placed,</h2>
        <p className="font-accent text-3xl font-semibold italic text-jollof">Ugo is cooking.</p>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-cocoa px-5 py-4 text-paper">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
            Order number
          </p>
          <p className="font-display text-2xl font-extrabold">{order.number}</p>
        </div>
        <p className="text-right text-sm">
          Arrives in
          <br />
          {order.etaLabel}
        </p>
      </div>

      <OrderTracker status={status} />

      <div className="mt-auto grid gap-3 pt-2 sm:grid-cols-2">
        {site && (
          <a
            href={buildWhatsappUrl(
              site.whatsappNumber,
              `Hi Ugo, I'd like to track order ${order.number}.`,
            )}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles({ variant: 'whatsapp', size: 'lg', fullWidth: true })}
          >
            Track on WhatsApp
          </a>
        )}
        <Button variant="outline" size="lg" fullWidth onClick={backToMenu}>
          Back to menu
        </Button>
      </div>
    </div>
  )
}

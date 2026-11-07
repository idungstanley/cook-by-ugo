import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { Appearance } from '@stripe/stripe-js'
import { Lock } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/format'
import { getStripe } from '@/lib/stripe'
import type { Pence } from '@/types'

/** Stripe's form in the site's colours and fonts. */
const APPEARANCE: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#C8401C',
    colorText: '#1C0F0A',
    colorBackground: '#F6EDE0',
    colorDanger: '#A83315',
    fontFamily: 'Manrope Variable, system-ui, sans-serif',
    borderRadius: '16px',
  },
}

const PAID_STATUSES = ['succeeded', 'processing', 'requires_capture']

interface PayFormProps {
  amount: Pence
  /** Where a bank sends the customer back to after approving the payment. */
  returnUrl: string
  onPaid: () => void
}

const PayForm = ({ amount, returnUrl, onPaid }: PayFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)

  const pay = async (event: FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) return
    setPaying(true)
    setError(null)
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    })
    setPaying(false)

    if (result.error) {
      setError(result.error.message ?? 'Your payment did not go through. Please try again.')
      return
    }
    if (PAID_STATUSES.includes(result.paymentIntent.status)) onPaid()
    else setError('Your payment was not completed. Please try again.')
  }

  return (
    <form onSubmit={(event) => void pay(event)} className="flex flex-1 flex-col gap-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && (
        <p role="alert" className="text-sm font-semibold text-jollof">
          {error}
        </p>
      )}
      <div className="mt-auto pt-2 text-center">
        <Button type="submit" size="lg" fullWidth disabled={!stripe || paying}>
          {paying ? 'Paying...' : `Pay ${formatPrice(amount)}`}
        </Button>
        <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted">
          <Lock className="size-3" /> Secure payment by Stripe. We never see your card details.
        </p>
      </div>
    </form>
  )
}

interface StripePaymentProps extends PayFormProps {
  publishableKey: string
  clientSecret: string
}

/** Stripe's card, Apple Pay and Google Pay form for a payment the server has started. */
export const StripePayment = ({ publishableKey, clientSecret, ...form }: StripePaymentProps) => (
  <Elements stripe={getStripe(publishableKey)} options={{ clientSecret, appearance: APPEARANCE }}>
    <PayForm {...form} />
  </Elements>
)

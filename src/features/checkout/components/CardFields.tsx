import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { TextField } from '@/components/ui/fields'
import type { CardFormInput } from '../checkout.schema'

interface CardFieldsProps {
  register: UseFormRegister<CardFormInput>
  errors: FieldErrors<CardFormInput>
}

/**
 * Mock fields that follow the design. These values are never sent anywhere, and must be replaced
 * by Stripe's Payment Element so card details never touch this app.
 */
export const CardFields = ({ register, errors }: CardFieldsProps) => (
  <div className="flex flex-col gap-3">
    <TextField
      label="Card number"
      placeholder="0000 0000 0000 0000"
      inputMode="numeric"
      autoComplete="cc-number"
      error={errors.cardNumber?.message}
      {...register('cardNumber')}
    />
    <div className="grid grid-cols-2 gap-3">
      <TextField
        label="Expiry"
        placeholder="MM / YY"
        inputMode="numeric"
        autoComplete="cc-exp"
        error={errors.expiry?.message}
        {...register('expiry')}
      />
      <TextField
        label="CVC"
        placeholder="123"
        inputMode="numeric"
        autoComplete="cc-csc"
        error={errors.cvc?.message}
        {...register('cvc')}
      />
    </div>
    <TextField
      label="Name on card"
      placeholder="As it appears on the card"
      autoComplete="cc-name"
      error={errors.nameOnCard?.message}
      {...register('nameOnCard')}
    />
  </div>
)

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/components/ui/fields'
import { ASAP_LABEL, DEFAULT_CITY, SCHEDULED_SLOTS } from '@/constants/checkout'
import { cn } from '@/lib/cn'
import { useCheckoutStore } from '@/stores/checkout.store'
import type { DeliveryTiming } from '@/types'
import { deliverySchema, type DeliveryFormValues } from '../checkout.schema'

const TIMING_OPTIONS: { value: DeliveryTiming; label: string }[] = [
  { value: 'asap', label: `ASAP · ${ASAP_LABEL}` },
  { value: 'scheduled', label: 'Schedule for later' },
]

export const DeliveryStep = () => {
  const savedDelivery = useCheckoutStore((state) => state.delivery)
  const saveDelivery = useCheckoutStore((state) => state.saveDelivery)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: savedDelivery ?? { city: DEFAULT_CITY, timing: 'asap' },
  })
  const timing = useWatch({ control, name: 'timing' })

  return (
    <form
      noValidate
      onSubmit={handleSubmit(saveDelivery)}
      className="flex flex-1 flex-col gap-4 px-5 pb-6 sm:px-8"
    >
      <h3 className="text-xl">Where should we bring it?</h3>
      <TextField
        label="Full name"
        placeholder="Your name"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register('fullName')}
      />
      <TextField
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextField
        label="Phone number"
        type="tel"
        placeholder="+44 7700 000000"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <TextField
        label="Delivery address"
        placeholder="Street address"
        autoComplete="street-address"
        error={errors.address?.message}
        {...register('address')}
      />
      <div className="grid grid-cols-[1.7fr_1fr] gap-3">
        <TextField
          label="City"
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register('city')}
        />
        <TextField
          label="Postcode"
          placeholder="NE1 ..."
          autoComplete="postal-code"
          error={errors.postcode?.message}
          {...register('postcode')}
        />
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold">Delivery time</legend>
        <div className="grid grid-cols-2 gap-3">
          {TIMING_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={timing === value}
              onClick={() => setValue('timing', value, { shouldValidate: true })}
              className={cn(
                'h-12 rounded-full border text-sm font-bold transition',
                timing === value ? 'border-cocoa bg-cocoa text-paper' : 'border-cocoa/40',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {timing === 'scheduled' && (
        <SelectField
          label="Choose a time"
          error={errors.scheduledSlot?.message}
          {...register('scheduledSlot')}
        >
          <option value="">Select a slot</option>
          {SCHEDULED_SLOTS.map((slot) => (
            <option key={slot}>{slot}</option>
          ))}
        </SelectField>
      )}

      <TextAreaField
        label="Delivery note (optional)"
        placeholder="Ring the bell, leave at the door, allergies..."
        error={errors.note?.message}
        {...register('note')}
      />

      <div className="mt-auto pt-2 text-center">
        <Button type="submit" size="lg" fullWidth>
          Continue to payment →
        </Button>
        <p className="mt-2 text-xs text-muted">You can still change your order on the next step.</p>
      </div>
    </form>
  )
}

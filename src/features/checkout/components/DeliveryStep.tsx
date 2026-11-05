import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { CircleCheck, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/components/ui/fields'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { useAccount } from '@/services/account/account.queries'
import { siteApi } from '@/services/site/site.api'
import { useDeliverySlots, useSiteInfo } from '@/services/site/site.queries'
import { useCheckoutStore } from '@/stores/checkout.store'
import { useUiStore } from '@/stores/ui.store'
import type { Account, DeliveryDetails, DeliveryTiming, PostcodeCheck } from '@/types'
import { deliverySchema, type DeliveryFormInput, type DeliveryFormValues } from '../checkout.schema'
import { splitPhone } from '../phone'
import { PhoneField } from './PhoneField'

const NOT_LISTED = 'not-listed'
const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i

const initialValues = (
  saved: DeliveryDetails | null,
  account: Account | null | undefined,
): DeliveryFormInput => {
  if (saved) {
    const { phone, ...rest } = saved
    return { ...rest, ...splitPhone(phone), postcodeConfirmed: true }
  }
  return {
    fullName: account?.name ?? '',
    email: account?.email ?? '',
    ...splitPhone(account?.phone),
    postcode: account?.address?.postcode ?? '',
    postcodeConfirmed: false,
    address: account?.address
      ? [account.address.line1, account.address.line2].filter(Boolean).join(', ')
      : '',
    city: account?.address?.city ?? '',
    timing: 'asap',
    marketingOptIn: account?.marketingOptIn ?? false,
  }
}

export const DeliveryStep = () => {
  const savedDelivery = useCheckoutStore((state) => state.delivery)
  const saveDelivery = useCheckoutStore((state) => state.saveDelivery)
  const closePanel = useUiStore((state) => state.closePanel)
  const { data: account } = useAccount()
  const { data: slots } = useDeliverySlots()
  const { data: site } = useSiteInfo()
  const [check, setCheck] = useState<PostcodeCheck | null>(null)
  const [addressChoice, setAddressChoice] = useState('')
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<DeliveryFormInput, unknown, DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: initialValues(savedDelivery, account),
  })
  const [timing, phoneCountry, postcodeConfirmed] = useWatch({
    control,
    name: ['timing', 'phoneCountry', 'postcodeConfirmed'],
  })

  const lookup = useMutation({
    mutationFn: siteApi.checkPostcode,
    onSuccess: (result) => {
      setCheck(result)
      setAddressChoice('')
      setValue('postcode', result.postcode)
      setValue('city', result.city, { shouldValidate: true })
      setValue('postcodeConfirmed', result.covered, { shouldValidate: true })
      if (result.addresses.length > 0) setValue('address', '')
    },
  })

  /** Only real-looking postcodes are sent, so an empty box never shows a confusing error. */
  const findAddress = () => {
    const postcode = getValues('postcode').trim()
    lookup.reset()
    if (!UK_POSTCODE.test(postcode)) {
      setError('postcode', { message: 'Enter a full UK postcode, like NE1 4ST' })
      return
    }
    clearErrors('postcode')
    lookup.mutate(postcode)
  }

  const chooseAddress = (choice: string) => {
    setAddressChoice(choice)
    const address = check?.addresses.find(({ id }) => id === choice)
    setValue('address', address ? [address.line1, address.line2].filter(Boolean).join(', ') : '', {
      shouldValidate: Boolean(address),
    })
    if (address) setValue('city', address.city, { shouldValidate: true })
  }

  const listedAddresses = check?.covered ? check.addresses : []
  const typingAddress =
    postcodeConfirmed && (listedAddresses.length === 0 || addressChoice === NOT_LISTED)
  const asapLabel = site ? `ASAP · about ${site.leadMinutes} min` : 'ASAP'
  const timingOptions: { value: DeliveryTiming; label: string }[] = [
    { value: 'asap', label: asapLabel },
    { value: 'scheduled', label: 'Schedule for later' },
  ]

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => saveDelivery(values))}
      className="flex flex-1 flex-col gap-4 px-5 pb-6 sm:px-8"
    >
      {!account && (
        <p className="rounded-2xl bg-shea px-4 py-3 text-sm">
          Have an account?{' '}
          <Link
            to="/account"
            onClick={closePanel}
            className="font-bold text-jollof underline-offset-2 hover:underline"
          >
            Sign in
          </Link>{' '}
          for faster checkout and to review your orders.
        </p>
      )}

      <h3 className="text-xl">Your details</h3>
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
      <PhoneField
        country={phoneCountry}
        error={errors.phoneNumber?.message}
        countryProps={register('phoneCountry')}
        numberProps={{ placeholder: '07400 123456', ...register('phoneNumber') }}
      />

      <h3 className="mt-2 text-xl">Where should we bring it?</h3>
      <div>
        {/* Errors sit under the whole row, so the button always lines up with the input. */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <TextField
              label="Postcode"
              placeholder="NE1 4ST"
              autoComplete="postal-code"
              className="uppercase"
              aria-invalid={errors.postcode || lookup.error ? true : undefined}
              {...register('postcode', {
                onChange: () => {
                  // A changed postcode has to be checked again before the address can be used.
                  setCheck(null)
                  setAddressChoice('')
                  setValue('postcodeConfirmed', false)
                },
              })}
            />
          </div>
          <Button
            variant="dark"
            className="h-12 shrink-0"
            disabled={lookup.isPending}
            onClick={findAddress}
          >
            <MapPin className="size-4" /> {lookup.isPending ? 'Checking...' : 'Find address'}
          </Button>
        </div>
        {(errors.postcode?.message || lookup.error) && (
          <p role="alert" className="mt-1 text-xs font-semibold text-jollof">
            {errors.postcode?.message ?? lookup.error?.message}
          </p>
        )}
        {check && !check.covered && (
          <p role="alert" className="mt-2 rounded-2xl bg-gold-soft px-4 py-3 text-sm">
            Sorry, {check.postcode} is {check.distanceMiles} miles from our kitchen. We deliver up
            to {check.maxMiles} miles away.
          </p>
        )}
        {check?.covered && (
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-ewedu">
            <CircleCheck className="size-4" /> We deliver to {check.postcode} ·{' '}
            {check.fee === 0 ? 'free delivery' : `delivery ${formatPrice(check.fee)}`}
          </p>
        )}
      </div>

      {listedAddresses.length > 0 && (
        <SelectField
          label="Choose your address"
          value={addressChoice}
          error={!typingAddress ? errors.address?.message : undefined}
          onChange={(event) => chooseAddress(event.target.value)}
        >
          <option value="">Select your address</option>
          {listedAddresses.map(({ id, line1, line2 }) => (
            <option key={id} value={id}>
              {[line1, line2].filter(Boolean).join(', ')}
            </option>
          ))}
          <option value={NOT_LISTED}>My address is not listed</option>
        </SelectField>
      )}

      {(typingAddress || (postcodeConfirmed && !check)) && (
        <TextField
          label="House number and street"
          placeholder="12 Grey Street, Flat 3"
          autoComplete="street-address"
          error={errors.address?.message}
          {...register('address')}
        />
      )}

      {postcodeConfirmed && (
        <TextField
          label="City"
          readOnly
          className="cursor-not-allowed text-muted"
          error={errors.city?.message}
          {...register('city')}
        />
      )}

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold">Delivery time</legend>
        <div className="grid grid-cols-2 gap-3">
          {timingOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={timing === value}
              onClick={() => setValue('timing', value, { shouldValidate: true })}
              className={cn(
                'h-12 rounded-full border px-2 text-sm font-bold transition',
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
          error={errors.scheduledFor?.message}
          {...register('scheduledFor')}
        >
          <option value="">{slots?.length ? 'Select a slot' : 'No slots left today'}</option>
          {slots?.map(({ at, label }) => (
            <option key={at} value={at}>
              {label}
            </option>
          ))}
        </SelectField>
      )}

      <TextAreaField
        label="Delivery note (optional)"
        placeholder="Ring the bell, leave at the door..."
        error={errors.note?.message}
        {...register('note')}
      />

      <TextField
        label="Allergies (optional)"
        placeholder="Tell us about any food allergy"
        error={errors.allergyNote?.message}
        {...register('allergyNote')}
      />

      <label className="flex items-start gap-2.5 text-sm">
        <input type="checkbox" className="mt-0.5 size-4" {...register('marketingOptIn')} />
        Send me offers by email. You can unsubscribe at any time.
      </label>

      {site && !site.isOpen && timing === 'asap' && (
        <p role="alert" className="text-sm font-semibold text-jollof">
          {site.ordersPaused
            ? 'We are not taking orders right now.'
            : 'We are closed right now. Please schedule your order for later.'}
        </p>
      )}

      <div className="mt-auto pt-2 text-center">
        <Button type="submit" size="lg" fullWidth>
          Continue to payment →
        </Button>
        <p className="mt-2 text-xs text-muted">You can still change your order on the next step.</p>
      </div>
    </form>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { CompactFooter } from '@/components/layout/CompactFooter'
import { Button } from '@/components/ui/Button'
import { buttonStyles } from '@/components/ui/button.styles'
import { Container } from '@/components/ui/Container'
import { TextField } from '@/components/ui/fields'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { Tag } from '@/components/ui/Tag'
import { PhoneField } from '@/features/checkout/components/PhoneField'
import { formatPhone, splitPhone } from '@/features/checkout/phone'
import { formatPrice } from '@/lib/format'
import {
  useAccount,
  useAccountOrders,
  useSignOut,
  useUpdateProfile,
} from '@/services/account/account.queries'
import type { Account, AccountOrder, OrderStatus } from '@/types'
import { AuthPanel } from './AuthPanel'

const STATUS_LABELS: Record<OrderStatus, string> = {
  'pending-payment': 'Awaiting payment',
  received: 'Received',
  'awaiting-customer': 'Action needed',
  preparing: 'Being prepared',
  'out-for-delivery': 'On its way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const profileSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your name'),
    phoneCountry: z.string(),
    phoneNumber: z.string().trim(),
    line1: z.string().trim(),
    city: z.string().trim(),
    postcode: z.string().trim().toUpperCase(),
  })
  .refine(
    ({ phoneNumber, phoneCountry }) => !phoneNumber || formatPhone(phoneCountry, phoneNumber),
    {
      path: ['phoneNumber'],
      message: 'Enter a valid phone number for that country',
    },
  )

type ProfileValues = z.infer<typeof profileSchema>

const ProfileForm = ({ account }: { account: Account }) => {
  const update = useUpdateProfile()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: account.name,
      ...splitPhone(account.phone),
      line1: account.address?.line1 ?? '',
      city: account.address?.city ?? '',
      postcode: account.address?.postcode ?? '',
    },
  })
  const phoneCountry = useWatch({ control, name: 'phoneCountry' })

  const save = ({
    name,
    phoneCountry: country,
    phoneNumber,
    line1,
    city,
    postcode,
  }: ProfileValues) =>
    update.mutate(
      {
        name,
        phone: phoneNumber ? (formatPhone(country, phoneNumber) ?? undefined) : undefined,
        address: line1 && city && postcode ? { line1, city, postcode } : undefined,
      },
      { onSuccess: () => reset(undefined, { keepValues: true }) },
    )

  return (
    <form
      noValidate
      onSubmit={handleSubmit(save)}
      className="flex flex-col gap-4 rounded-card bg-paper p-5 shadow-sm"
    >
      <h2 className="text-xl">Your details</h2>
      <p className="-mt-3 text-sm text-muted">Saved here, they fill in checkout for you.</p>
      <TextField label="Full name" error={errors.name?.message} {...register('name')} />
      <PhoneField
        country={phoneCountry}
        error={errors.phoneNumber?.message}
        countryProps={register('phoneCountry')}
        numberProps={register('phoneNumber')}
      />
      <TextField label="House number and street" {...register('line1')} />
      <div className="grid grid-cols-[1.6fr_1fr] gap-3">
        <TextField label="City" {...register('city')} />
        <TextField label="Postcode" className="uppercase" {...register('postcode')} />
      </div>
      <Button type="submit" disabled={!isDirty || update.isPending} className="self-start">
        {update.isSuccess && !isDirty ? 'Saved' : 'Save details'}
      </Button>
    </form>
  )
}

const OrderRow = ({ order }: { order: AccountOrder }) => (
  <li className="flex flex-col gap-2 border-b border-line py-4 last:border-b-0">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="font-display text-lg font-extrabold">{order.number}</p>
      <Tag
        tone={
          order.status === 'awaiting-customer'
            ? 'jollof'
            : order.status === 'delivered'
              ? 'ewedu'
              : order.status === 'cancelled'
                ? 'paper'
                : 'gold'
        }
      >
        {STATUS_LABELS[order.status]}
      </Tag>
    </div>
    <p className="text-sm text-muted">
      {dateFormat.format(order.createdAt)} ·{' '}
      {order.items.map(({ quantity, name }) => `${quantity} × ${name}`).join(', ')}
    </p>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="font-semibold">{formatPrice(order.total)}</p>
      <div className="flex gap-2">
        {order.status === 'awaiting-customer' && (
          <Link
            to="/track/$orderId"
            params={{ orderId: order.id }}
            search={{ key: order.trackingKey }}
            hash="update"
            className={buttonStyles({ size: 'sm' })}
          >
            Update order
          </Link>
        )}
        {order.status === 'delivered' && !order.reviewed && (
          <Link
            to="/track/$orderId"
            params={{ orderId: order.id }}
            search={{ key: order.trackingKey }}
            hash="review"
            className={buttonStyles({ size: 'sm' })}
          >
            <Star className="size-3.5" /> Rate order
          </Link>
        )}
        <Link
          to="/track/$orderId"
          params={{ orderId: order.id }}
          search={{ key: order.trackingKey }}
          className={buttonStyles({ variant: 'outline', size: 'sm' })}
        >
          {order.status === 'delivered' ? 'View' : 'Track'}
        </Link>
      </div>
    </div>
  </li>
)

const SignedIn = ({ account }: { account: Account }) => {
  const signOut = useSignOut()
  const { data: orders, isPending } = useAccountOrders(true)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-jollof">Your account</p>
          <h1 className="text-4xl">Hi {account.name.split(' ')[0]}</h1>
          <p className="text-sm text-muted">{account.email}</p>
        </div>
        <ProfileForm account={account} />
        <Button variant="ghost" className="self-start" onClick={() => signOut.mutate()}>
          Sign out
        </Button>
      </div>
      <section className="rounded-card bg-paper p-5 shadow-sm">
        <h2 className="text-xl">Your orders</h2>
        {isPending ? (
          <p className="py-6 text-sm text-muted">Loading your orders...</p>
        ) : orders?.length ? (
          <ul>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </ul>
        ) : (
          <StatusMessage
            title="No orders yet"
            body="Orders you place while signed in will show here."
            action={
              <Link to="/menu" className={buttonStyles()}>
                See the menu
              </Link>
            }
          />
        )}
      </section>
    </div>
  )
}

export const AccountPage = () => {
  const { data: account, isPending } = useAccount()

  return (
    <>
      <Container className="py-10 md:py-14">
        {isPending ? (
          <StatusMessage title="Loading..." />
        ) : account ? (
          <SignedIn account={account} />
        ) : (
          <AuthPanel />
        )}
      </Container>
      <CompactFooter />
    </>
  )
}

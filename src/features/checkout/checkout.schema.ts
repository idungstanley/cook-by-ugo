import { z } from 'zod'
import { DELIVERY_POSTCODE_PREFIX } from '@/constants/checkout'

const UK_PHONE = /^(\+44\s?|0)7\d{3}\s?\d{6}$|^(\+44\s?|0)\d{2,4}\s?\d{3,4}\s?\d{3,4}$/
const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i

export const deliverySchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your name'),
    email: z.email('Enter a valid email, so we can send your receipt'),
    phone: z.string().trim().regex(UK_PHONE, 'Enter a valid UK phone number'),
    address: z.string().trim().min(4, 'Enter your street address'),
    city: z.string().trim().min(2, 'Enter your city'),
    postcode: z
      .string()
      .trim()
      .regex(UK_POSTCODE, 'Enter a valid postcode')
      .refine((value) => value.toUpperCase().startsWith(DELIVERY_POSTCODE_PREFIX), {
        message: 'Sorry, we only deliver to NE postcodes for now',
      }),
    timing: z.enum(['asap', 'scheduled']),
    scheduledSlot: z.string().optional(),
    note: z.string().trim().max(200, 'Keep your note under 200 characters').optional(),
  })
  .refine((value) => value.timing === 'asap' || Boolean(value.scheduledSlot), {
    path: ['scheduledSlot'],
    message: 'Choose a delivery time',
  })

export const cardSchema = z.object({
  cardNumber: z
    .string()
    .transform((value) => value.replace(/\s/g, ''))
    .pipe(z.string().regex(/^\d{13,19}$/, 'Enter a valid card number')),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/, 'Use MM / YY'),
  cvc: z.string().regex(/^\d{3,4}$/, 'Enter the 3 or 4 digit code'),
  nameOnCard: z.string().trim().min(2, 'Enter the name on the card'),
})

export type DeliveryFormValues = z.infer<typeof deliverySchema>
export type CardFormInput = z.input<typeof cardSchema>

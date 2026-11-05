import { z } from 'zod'
import { formatPhone } from './phone'

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i

export const deliverySchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your name'),
    email: z.email('Enter a valid email, so we can send your receipt'),
    phoneCountry: z.string().min(2),
    phoneNumber: z.string().trim().min(1, 'Enter your phone number'),
    postcode: z.string().trim().regex(UK_POSTCODE, 'Enter a valid postcode'),
    /** Set once the postcode has been checked and is inside the delivery area. */
    postcodeConfirmed: z.boolean(),
    address: z.string().trim().min(4, 'Choose or enter your street address'),
    city: z.string().trim().min(2, 'Enter your city'),
    timing: z.enum(['asap', 'scheduled']),
    scheduledFor: z.coerce.number().optional(),
    note: z.string().trim().max(200, 'Keep your note under 200 characters').optional(),
    allergyNote: z.string().trim().max(200, 'Keep this under 200 characters').optional(),
    marketingOptIn: z.boolean(),
  })
  .refine((value) => value.timing === 'asap' || Boolean(value.scheduledFor), {
    path: ['scheduledFor'],
    message: 'Choose a delivery time',
  })
  .refine((value) => value.postcodeConfirmed, {
    path: ['postcode'],
    message: 'Find your address so we can check we deliver there',
  })
  .refine((value) => formatPhone(value.phoneCountry, value.phoneNumber) !== null, {
    path: ['phoneNumber'],
    message: 'Enter a valid phone number for that country',
  })
  .transform(
    ({ fullName, email, phoneCountry, phoneNumber, postcode, address, city, ...rest }) => ({
      fullName,
      email,
      phone: formatPhone(phoneCountry, phoneNumber) ?? phoneNumber,
      postcode,
      address,
      city,
      timing: rest.timing,
      scheduledFor: rest.scheduledFor,
      note: rest.note,
      allergyNote: rest.allergyNote,
      marketingOptIn: rest.marketingOptIn,
    }),
  )

export type DeliveryFormValues = z.output<typeof deliverySchema>
export type DeliveryFormInput = z.input<typeof deliverySchema>

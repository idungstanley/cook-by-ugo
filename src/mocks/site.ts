import type { SiteInfo } from '@/types'

/** Contact details are the placeholders from the design until the client confirms them. */
export const siteInfo: SiteInfo = {
  phone: '0191 234 5678',
  phoneHref: 'tel:+441912345678',
  email: 'hello@cookbyugo.co.uk',
  whatsappNumber: '441912345678',
  areaLabel: 'Newcastle upon Tyne, NE1',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Newcastle+upon+Tyne+NE1',
  deliveryWindow: '35 to 45 min',
  hours: [
    {
      label: 'Mon to Thu',
      days: [1, 2, 3, 4],
      opensAtHour: 12,
      closesAtHour: 21,
      hoursLabel: '12pm to 9pm',
    },
    {
      label: 'Fri to Sat',
      days: [5, 6],
      opensAtHour: 12,
      closesAtHour: 22,
      hoursLabel: '12pm to 10pm',
    },
    { label: 'Sunday', days: [0], opensAtHour: 13, closesAtHour: 20, hoursLabel: '1pm to 8pm' },
  ],
}

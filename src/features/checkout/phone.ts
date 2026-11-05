import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js'

export const DEFAULT_COUNTRY: CountryCode = 'GB'

/** Most customers are in the UK, with family and friends ordering from these countries too. */
const PINNED: CountryCode[] = ['GB', 'NG', 'IE', 'GH', 'US']

const regionNames = new Intl.DisplayNames(['en-GB'], { type: 'region' })

const flag = (country: string) =>
  String.fromCodePoint(...[...country].map((letter) => 0x1f1a5 + letter.charCodeAt(0)))

const toOption = (country: CountryCode) => ({
  country,
  label: `${flag(country)} ${regionNames.of(country) ?? country} (+${getCountryCallingCode(country)})`,
  short: `${flag(country)} +${getCountryCallingCode(country)}`,
})

export const COUNTRY_OPTIONS = [
  ...PINNED.map(toOption),
  ...getCountries()
    .filter((country) => !PINNED.includes(country))
    .map(toOption)
    .sort((a, b) => a.label.slice(3).localeCompare(b.label.slice(3))),
]

/** The number in international format, or null when it is not a real number for that country. */
export const formatPhone = (country: string, number: string) => {
  const phone = parsePhoneNumberFromString(number, country as CountryCode)
  return phone?.isValid() ? phone.formatInternational() : null
}

/** Splits a saved international number back into the two checkout fields. */
export const splitPhone = (phone?: string) => {
  const parsed = phone ? parsePhoneNumberFromString(phone) : undefined
  return {
    phoneCountry: parsed?.country ?? DEFAULT_COUNTRY,
    phoneNumber: parsed ? parsed.formatNational() : (phone ?? ''),
  }
}

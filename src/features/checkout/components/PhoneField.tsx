import { useId, type ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { COUNTRY_OPTIONS } from '../phone'

interface PhoneFieldProps {
  error?: string
  countryProps: ComponentProps<'select'>
  numberProps: ComponentProps<'input'>
  country: string
}

const CONTROL =
  'h-12 rounded-2xl border border-line bg-shea text-sm text-cocoa transition focus:border-cocoa'

/** A country code picker beside the number, so numbers from any country are checked properly. */
export const PhoneField = ({ error, countryProps, numberProps, country }: PhoneFieldProps) => {
  const id = useId()
  const selected = COUNTRY_OPTIONS.find((option) => option.country === country)

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        Phone number
      </label>
      <div className="flex gap-2">
        <div className="relative shrink-0">
          {/* The closed select shows the short code; the open list shows country names. */}
          <span
            aria-hidden
            className={cn(
              CONTROL,
              'pointer-events-none flex items-center gap-1 px-3 font-semibold',
            )}
          >
            {selected?.short ?? country} <span className="text-muted">▾</span>
          </span>
          <select
            aria-label="Country code"
            className="absolute inset-0 cursor-pointer opacity-0"
            {...countryProps}
          >
            {COUNTRY_OPTIONS.map(({ country: code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <input
          id={id}
          type="tel"
          autoComplete="tel-national"
          className={cn(CONTROL, 'w-full min-w-0 px-4 placeholder:text-muted')}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...numberProps}
        />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-semibold text-jollof">
          {error}
        </p>
      )}
    </div>
  )
}

import { useMutation } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { siteApi } from '@/services/site/site.api'
import { useSiteInfo } from '@/services/site/site.queries'
import { AddressSearch } from './AddressSearch'

export interface FoundAddress {
  line1: string
  city: string
  postcode: string
}

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i
const CONTROL =
  'h-12 w-full rounded-2xl border border-line bg-shea px-4 text-sm text-cocoa placeholder:text-muted transition focus:border-cocoa'

/**
 * Type a postcode, pick the address from the Royal Mail list, and the form below fills in.
 * Hidden until address lookup is switched on, so the form works the same without it.
 */
export const AddressFinder = ({ onPick }: { onPick: (address: FoundAddress) => void }) => {
  const { data: site } = useSiteInfo()
  const id = useId()
  const [postcode, setPostcode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const lookup = useMutation({ mutationFn: siteApi.findAddresses })

  if (site?.addressSearch) return <AddressSearch onPick={onPick} />
  if (!site?.addressLookup) return null

  const find = () => {
    setError(null)
    lookup.reset()
    if (!UK_POSTCODE.test(postcode.trim())) {
      setError('Enter a full UK postcode, like NE1 4ST')
      return
    }
    lookup.mutate(postcode)
  }

  const pick = (choice: string) => {
    const result = lookup.data
    const address = result?.addresses.find((option) => option.id === choice)
    if (!result || !address) return
    onPick({
      line1: [address.line1, address.line2].filter(Boolean).join(', '),
      city: address.city,
      postcode: result.postcode,
    })
  }

  const message = error ?? lookup.error?.message
  const found = lookup.data

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-line p-3">
      <label htmlFor={`${id}-postcode`} className="text-sm font-semibold">
        Find your address
      </label>
      <div className="flex gap-2">
        <input
          id={`${id}-postcode`}
          value={postcode}
          onChange={(event) => setPostcode(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              find()
            }
          }}
          placeholder="Postcode, e.g. NE1 4ST"
          autoComplete="postal-code"
          className={`${CONTROL} uppercase`}
        />
        <Button type="button" variant="dark" onClick={find} disabled={lookup.isPending}>
          <Search className="size-4" aria-hidden /> {lookup.isPending ? 'Finding...' : 'Find'}
        </Button>
      </div>
      {message && (
        <p role="alert" className="text-xs font-semibold text-jollof">
          {message}
        </p>
      )}
      {found &&
        (found.addresses.length > 0 ? (
          <select
            aria-label="Choose your address"
            defaultValue=""
            onChange={(event) => pick(event.target.value)}
            className={CONTROL}
          >
            <option value="" disabled>
              Choose your address ({found.addresses.length} found)
            </option>
            {found.addresses.map((option) => (
              <option key={option.id} value={option.id}>
                {[option.line1, option.line2].filter(Boolean).join(', ')}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-xs text-muted">
            No addresses listed for {found.postcode}. Please type your address below.
          </p>
        ))}
    </div>
  )
}

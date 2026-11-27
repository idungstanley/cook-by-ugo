import { useMutation, useQuery } from '@tanstack/react-query'
import { MapPin, Search } from 'lucide-react'
import { useId, useState } from 'react'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { siteApi } from '@/services/site/site.api'
import type { FoundAddress } from './AddressFinder'

const newSession = () => crypto.randomUUID()

/**
 * Type-ahead address search with Google Places. Suggestions appear as the customer types; a
 * tap fills the street, town and postcode. The customer can always type the address instead.
 */
export const AddressSearch = ({
  onPick,
  label = 'Search for your address',
}: {
  onPick: (address: FoundAddress) => void
  label?: string
}) => {
  const id = useId()
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [session, setSession] = useState(newSession)
  const query = useDebouncedValue(text.trim(), 300)

  const suggestions = useQuery({
    queryKey: ['address-search', query, session],
    queryFn: () => siteApi.searchAddresses(query, session),
    enabled: query.length >= 3,
    staleTime: 60_000,
    retry: false,
  })
  const choose = useMutation({
    mutationFn: (placeId: string) => siteApi.getPlaceAddress(placeId, session),
    onSuccess: (address) => {
      onPick(address)
      setText([address.line1, address.postcode].filter(Boolean).join(', '))
      setOpen(false)
      // Each pick ends a billed search session, so the next search starts a fresh one.
      setSession(newSession())
    },
  })

  const list = suggestions.data ?? []
  const showList = open && query.length >= 3 && list.length > 0
  const message = choose.error?.message ?? suggestions.error?.message

  return (
    <div className="relative">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          id={id}
          role="combobox"
          aria-expanded={showList}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          autoComplete="off"
          value={text}
          placeholder="Start typing, e.g. 12 Grey Street"
          onChange={(event) => {
            setText(event.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(event) => {
            if (!showList) return
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setActive((index) => Math.min(index + 1, list.length - 1))
            } else if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActive((index) => Math.max(index - 1, 0))
            } else if (event.key === 'Enter' && list[active]) {
              event.preventDefault()
              choose.mutate(list[active].id)
            } else if (event.key === 'Escape') {
              setOpen(false)
            }
          }}
          className="h-12 w-full rounded-2xl border border-line bg-shea pl-10 pr-4 text-sm text-cocoa transition placeholder:text-muted focus:border-cocoa"
        />
      </div>
      {showList && (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-2xl border border-line bg-paper py-1 shadow-float"
        >
          {list.map((suggestion, index) => (
            <li
              key={suggestion.id}
              role="option"
              aria-selected={index === active}
              onMouseDown={(event) => {
                event.preventDefault()
                choose.mutate(suggestion.id)
              }}
              className={`flex cursor-pointer items-start gap-2 px-4 py-2.5 text-sm ${
                index === active ? 'bg-shea' : 'hover:bg-shea'
              }`}
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
              <span>
                <span className="font-semibold">{suggestion.text}</span>
                {suggestion.secondary && (
                  <span className="block text-xs text-muted">{suggestion.secondary}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      {choose.isPending && <p className="mt-1 text-xs text-muted">Getting the address...</p>}
      {message && (
        <p role="alert" className="mt-1 text-xs font-semibold text-jollof">
          {message}
        </p>
      )}
      <p className="mt-1 text-xs text-muted">
        Can&apos;t find it? Fill in the boxes below instead.
      </p>
    </div>
  )
}

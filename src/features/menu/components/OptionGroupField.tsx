import { Check } from 'lucide-react'
import { RadioCard } from '@/components/ui/RadioCard'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/cn'
import { formatPriceDelta } from '@/lib/format'
import type { OptionChoice, OptionGroup } from '@/types'

interface OptionGroupFieldProps {
  group: OptionGroup
  selected: string[]
  onToggle: (choiceId: string) => void
}

const ChipChoice = ({
  choice,
  active,
  onToggle,
}: {
  choice: OptionChoice
  active: boolean
  onToggle: () => void
}) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onToggle}
    className={cn(
      'inline-flex h-10 items-center gap-1 rounded-full border px-3 text-sm font-semibold transition',
      active ? 'border-ewedu bg-ewedu text-white' : 'border-line bg-paper hover:border-cocoa/40',
    )}
  >
    {active ? <Check className="size-4" strokeWidth={3} /> : <span aria-hidden>+</span>}
    {choice.label} <span className="font-medium">{formatPriceDelta(choice.priceDelta)}</span>
  </button>
)

export const OptionGroupField = ({ group, selected, onToggle }: OptionGroupFieldProps) => (
  <fieldset className="min-w-0">
    <legend className="mb-2 flex items-center gap-2">
      <span className="font-display text-lg font-bold">{group.title}</span>
      {group.helperText && <span className="text-xs text-muted">{group.helperText}</span>}
      {group.kind === 'radio' &&
        (selected.length > 0 ? <Tag tone="ewedu">Done</Tag> : <Tag tone="jollof">Required</Tag>)}
    </legend>

    {group.kind === 'radio' && (
      <div className="grid grid-cols-2 gap-2">
        {group.choices.map((choice) => (
          <RadioCard
            key={choice.id}
            name={group.id}
            title={choice.label}
            selected={selected.includes(choice.id)}
            onSelect={() => onToggle(choice.id)}
          />
        ))}
      </div>
    )}

    {group.kind === 'chips' && (
      <div className="flex flex-wrap gap-2">
        {group.choices.map((choice) => (
          <ChipChoice
            key={choice.id}
            choice={choice}
            active={selected.includes(choice.id)}
            onToggle={() => onToggle(choice.id)}
          />
        ))}
      </div>
    )}

    {group.kind === 'segmented' && (
      <div className="grid auto-cols-fr grid-flow-col rounded-full bg-shea p-1">
        {group.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            aria-pressed={selected.includes(choice.id)}
            onClick={() => onToggle(choice.id)}
            className={cn(
              'h-9 rounded-full text-sm font-semibold transition',
              selected.includes(choice.id) && 'bg-jollof text-white',
            )}
          >
            {choice.label}
          </button>
        ))}
      </div>
    )}
  </fieldset>
)

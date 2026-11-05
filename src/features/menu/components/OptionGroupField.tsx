import { Check } from 'lucide-react'
import { forwardRef } from 'react'
import { FoodImage } from '@/components/ui/FoodImage'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/cn'
import { formatPriceDelta } from '@/lib/format'
import type { OptionChoice, OptionGroup } from '@/types'

interface ChoiceRowProps {
  group: OptionGroup
  choice: OptionChoice
  active: boolean
  showImage: boolean
  onToggle: () => void
}

/** A side or soup as a small card with its photo and price, like the upsell in the basket. */
const ChoiceRow = ({ group, choice, active, showImage, onToggle }: ChoiceRowProps) => {
  const single = group.maxChoices === 1

  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-2xl border p-2 pr-4 transition',
        'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-jollof',
        active ? 'border-cocoa bg-cocoa text-paper' : 'border-line bg-shea hover:border-cocoa/40',
        !showImage && 'py-3 pl-4',
      )}
    >
      <input
        type={single ? 'radio' : 'checkbox'}
        name={group.id}
        checked={active}
        onChange={onToggle}
        className="sr-only"
      />
      {showImage && (
        <FoodImage src={choice.image} alt="" className="size-12 shrink-0 rounded-full" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold leading-tight">{choice.label}</span>
        <span className={cn('block text-xs', active ? 'text-paper/75' : 'text-muted')}>
          {choice.priceDelta > 0 ? formatPriceDelta(choice.priceDelta) : 'Included'}
        </span>
      </span>
      <span
        aria-hidden
        className={cn(
          'grid size-5 shrink-0 place-items-center border-2',
          single ? 'rounded-full' : 'rounded-md',
          active ? 'border-gold bg-gold text-cocoa' : 'border-muted/60',
        )}
      >
        {active && !single && <Check className="size-3.5" strokeWidth={3.5} />}
      </span>
    </label>
  )
}

interface OptionGroupFieldProps {
  group: OptionGroup
  selected: string[]
  /** Briefly outlined when the customer tries to continue without answering it. */
  highlighted?: boolean
  onToggle: (choiceId: string) => void
}

export const OptionGroupField = forwardRef<HTMLFieldSetElement, OptionGroupFieldProps>(
  ({ group, selected, highlighted, onToggle }, ref) => {
    const answered = selected.length > 0
    const showImages = group.choices.some(({ image }) => image)
    const hint = group.maxChoices === 1 ? 'Choose 1' : `Choose up to ${group.maxChoices}`

    return (
      <fieldset
        ref={ref}
        className={cn(
          'min-w-0 scroll-mt-4 rounded-3xl transition-shadow duration-300',
          highlighted && 'ring-2 ring-jollof ring-offset-4 ring-offset-paper',
        )}
      >
        <legend className="mb-2 flex w-full flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-display text-lg font-bold">{group.title}</span>
          {group.required ? (
            <Tag tone={answered ? 'ewedu' : 'jollof'}>{answered ? 'Done' : 'Required'}</Tag>
          ) : (
            <Tag className="bg-shea">Optional</Tag>
          )}
          <span className="basis-full text-xs text-muted">{group.helperText ?? hint}</span>
        </legend>

        {group.kind === 'segmented' ? (
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
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {group.choices.map((choice) => (
              <ChoiceRow
                key={choice.id}
                group={group}
                choice={choice}
                active={selected.includes(choice.id)}
                showImage={showImages}
                onToggle={() => onToggle(choice.id)}
              />
            ))}
          </div>
        )}
      </fieldset>
    )
  },
)
OptionGroupField.displayName = 'OptionGroupField'

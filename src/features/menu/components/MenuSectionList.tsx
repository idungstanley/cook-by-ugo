import { cn } from '@/lib/cn'
import { pluralise } from '@/lib/format'
import type { Category, MenuSection } from '@/types'
import { DishCard } from './DishCard'

const ACCENTS: Record<Category['accent'], string> = {
  jollof: 'bg-jollof',
  ewedu: 'bg-ewedu',
  indigo: 'bg-indigo',
  gold: 'bg-gold',
}

export const MenuSectionList = ({ sections }: { sections: MenuSection[] }) => (
  <div className="flex flex-col gap-10 md:gap-16">
    {sections.map(({ category, dishes }) => (
      <section key={category.id} aria-labelledby={category.id}>
        <div className="mb-4 flex items-baseline gap-3 md:mb-6 md:gap-5">
          <span
            aria-hidden
            className={cn('hidden size-3 rotate-45 md:block', ACCENTS[category.accent])}
          />
          <h2 id={category.id} className="text-2xl md:text-4xl">
            {category.name}
          </h2>
          <span className="hidden text-sm text-muted md:inline">
            {pluralise(dishes.length, 'dish', 'dishes')}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} layout="row" />
          ))}
        </div>
      </section>
    ))}
  </div>
)

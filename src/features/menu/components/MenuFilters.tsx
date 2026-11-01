import { Search } from 'lucide-react'
import { Chip } from '@/components/ui/Chip'
import type { Category, CategoryId } from '@/types'

interface MenuFiltersProps {
  categories: Category[]
  counts: { total: number; byCategory: Map<CategoryId, number> }
  activeCategory: CategoryId | undefined
  onCategoryChange: (category: CategoryId | undefined) => void
  search: string
  onSearchChange: (search: string) => void
}

export const MenuFilters = ({
  categories,
  counts,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
}: MenuFiltersProps) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3 md:rounded-full md:bg-paper md:p-2">
    <label className="flex h-12 items-center gap-2 rounded-full border border-line bg-paper px-4 md:w-80 md:shrink-0 md:border-0 md:bg-shea">
      <Search className="size-4 text-muted" aria-hidden />
      <span className="sr-only">Search the menu</span>
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search jollof, suya, egusi..."
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
      />
    </label>

    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0">
      <Chip active={!activeCategory} onClick={() => onCategoryChange(undefined)}>
        All <span className="max-md:hidden">{counts.total}</span>
      </Chip>
      {categories.map((category) => (
        <Chip
          key={category.id}
          active={activeCategory === category.id}
          onClick={() => onCategoryChange(category.id)}
          className="md:border-transparent"
        >
          <span className="md:hidden">{category.shortName}</span>
          <span className="max-md:hidden">
            {category.name} {counts.byCategory.get(category.id)}
          </span>
        </Chip>
      ))}
    </div>
  </div>
)

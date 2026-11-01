import { useMemo } from 'react'
import { useCategories, useDishes } from '@/services/menu/menu.queries'
import type { CategoryId, MenuSection } from '@/types'

/** Groups dishes by category, applying the active category and search term. */
export const useMenuSections = (categoryId: CategoryId | undefined, searchTerm: string) => {
  const categoriesQuery = useCategories()
  const dishesQuery = useDishes()
  const { data: categories } = categoriesQuery
  const { data: dishes } = dishesQuery

  const sections = useMemo<MenuSection[]>(() => {
    const term = searchTerm.trim().toLowerCase()

    return (categories ?? [])
      .filter((category) => !categoryId || category.id === categoryId)
      .map((category) => ({
        category,
        dishes: (dishes ?? []).filter(
          (dish) =>
            dish.categoryId === category.id &&
            (!term || `${dish.name} ${dish.description}`.toLowerCase().includes(term)),
        ),
      }))
      .filter((section) => section.dishes.length > 0)
  }, [categories, dishes, categoryId, searchTerm])

  const counts = useMemo(() => {
    const byCategory = new Map<CategoryId, number>()
    dishes?.forEach(({ categoryId: id }) => byCategory.set(id, (byCategory.get(id) ?? 0) + 1))
    return { total: dishes?.length ?? 0, byCategory }
  }, [dishes])

  return {
    categories: categories ?? [],
    sections,
    counts,
    isPending: categoriesQuery.isPending || dishesQuery.isPending,
    isError: categoriesQuery.isError || dishesQuery.isError,
    refetch: () => {
      void categoriesQuery.refetch()
      void dishesQuery.refetch()
    },
  }
}

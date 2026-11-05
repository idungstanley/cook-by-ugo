import { Button } from '@/components/ui/Button'
import { FoodImage } from '@/components/ui/FoodImage'
import { UPSELL_DISH_ID } from '@/constants/checkout'
import { formatPrice } from '@/lib/format'
import { useDishes } from '@/services/menu/menu.queries'
import { useCartStore } from '@/stores/cart.store'

export const CartUpsell = () => {
  const { data: dishes } = useDishes()
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const dish = dishes?.find(({ id }) => id === UPSELL_DISH_ID)

  if (!dish || items.some(({ productId }) => productId === dish.id)) return null

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gold-soft p-3">
      <FoodImage src={dish.image} alt="" className="size-14 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold leading-tight">Add Fried Plantain?</p>
        <p className="text-xs text-muted">
          <span className="hidden sm:inline">The side everyone steals · </span>
          {formatPrice(dish.price)}
        </p>
      </div>
      <Button
        variant="dark"
        size="sm"
        onClick={() =>
          addItem({
            productId: dish.id,
            name: dish.name,
            image: dish.image,
            unitPrice: dish.price,
          })
        }
      >
        + Add
      </Button>
    </div>
  )
}

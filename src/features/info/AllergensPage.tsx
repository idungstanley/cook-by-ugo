import { Link } from '@tanstack/react-router'
import { useDishes } from '@/services/menu/menu.queries'
import { InfoPage } from './InfoPage'

/** The 14 allergens UK food businesses must declare. */
const UK_ALLERGENS = [
  'Celery',
  'Cereals containing gluten',
  'Crustaceans',
  'Eggs',
  'Fish',
  'Lupin',
  'Milk',
  'Molluscs',
  'Mustard',
  'Tree nuts',
  'Peanuts',
  'Sesame',
  'Soya',
  'Sulphites',
]

export const AllergensPage = () => {
  const { data: dishes = [] } = useDishes()

  return (
    <InfoPage
      eyebrow="Allergens"
      title="What is in"
      accent="our food."
      intro="If you have a food allergy or intolerance, please tell us before you order, by message or in the allergy box at checkout."
    >
      <p>
        Every dish is cooked in one kitchen that handles all 14 major allergens, so we cannot
        promise any dish is completely free of them. Recipes can change, so please check with us
        each time you order.
      </p>

      <h2>Allergens in each dish</h2>
      <div className="overflow-hidden rounded-card bg-paper shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-shea text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-4 py-3">
                Dish
              </th>
              <th scope="col" className="px-4 py-3">
                Contains
              </th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish) => (
              <tr key={dish.id} className="border-t border-line align-top">
                <th scope="row" className="px-4 py-3 font-semibold">
                  {dish.name}
                </th>
                <td className="px-4 py-3">
                  {dish.allergens.length > 0 ? dish.allergens.join(', ') : 'None listed'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted">
        Sides and extras you add to a dish can contain other allergens. Ask us about any of them.
      </p>

      <h2>The 14 major allergens</h2>
      <ul className="grid gap-1 sm:grid-cols-2">
        {UK_ALLERGENS.map((allergen) => (
          <li key={allergen}>{allergen}</li>
        ))}
      </ul>

      <p>
        Questions? <Link to="/contact">Contact the kitchen</Link> before you order.
      </p>
    </InfoPage>
  )
}

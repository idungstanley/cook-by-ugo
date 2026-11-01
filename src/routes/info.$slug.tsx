import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { CompactFooter } from '@/components/layout/CompactFooter'
import { buttonStyles } from '@/components/ui/button.styles'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { INFO_PAGES } from '@/constants/navigation'

/** Linked in the design but not designed yet, so these hold the links until content arrives. */
const InfoPage = () => {
  const { title } = Route.useLoaderData()

  return (
    <>
      <StatusMessage
        title={title}
        body="This page is coming soon."
        action={
          <Link to="/menu" className={buttonStyles()}>
            See the menu
          </Link>
        }
      />
      <CompactFooter />
    </>
  )
}

export const Route = createFileRoute('/info/$slug')({
  loader: ({ params }) => {
    const title = INFO_PAGES[params.slug]
    if (!title) throw notFound()
    return { title }
  },
  component: InfoPage,
})

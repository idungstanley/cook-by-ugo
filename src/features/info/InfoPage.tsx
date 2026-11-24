import type { ReactNode } from 'react'
import { CompactFooter } from '@/components/layout/CompactFooter'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

interface InfoPageProps {
  eyebrow: string
  title: string
  accent: string
  intro?: ReactNode
  children: ReactNode
}

/** A plain reading page, such as Privacy or Allergens. */
export const InfoPage = ({ eyebrow, title, accent, intro, children }: InfoPageProps) => (
  <>
    <Container className="max-w-3xl py-10 md:py-16">
      <SectionHeading as="h1" eyebrow={eyebrow} title={title} accent={accent} />
      {intro && <div className="mt-5 text-lg text-cocoa/80">{intro}</div>}
      <div className="mt-8 flex flex-col gap-6 leading-relaxed [&_a]:font-semibold [&_a]:text-jollof [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mt-4 [&_h2]:text-2xl [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </Container>
    <CompactFooter />
  </>
)

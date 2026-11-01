/** Router links in the navigation constants carry a hash, a slug, or neither. */
interface NavTarget {
  to: string
  hash?: string
  slug?: string
}

export const navLinkProps = (link: NavTarget) =>
  ({
    to: link.to,
    hash: link.hash,
    params: link.slug ? { slug: link.slug } : undefined,
  }) as { to: '/' }

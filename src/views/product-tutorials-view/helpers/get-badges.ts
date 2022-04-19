import {
  ProductUsed as ClientProductUsed,
  EditionOption,
  BadgeOption,
} from 'lib/learn-client/types'

/** generate a list of UI badges for tutorials */
export function getBadges(
  productsUsed: ClientProductUsed[] = [],
  edition: EditionOption
): BadgeOption[] {
  const badges = []

  if (edition !== EditionOption.openSource) {
    badges.push(edition)
  }

  productsUsed.forEach((product) => {
    const isBeta =
      typeof product === 'object' && product.isBeta && !badges.includes('beta')

    if (isBeta) {
      badges.push('beta')
    }
  })

  return badges
}

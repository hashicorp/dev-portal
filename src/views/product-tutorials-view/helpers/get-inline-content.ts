import { getCollections } from 'lib/learn-client/api/collection'
import { getTutorials } from 'lib/learn-client/api/tutorial'
import { Tutorial as ClientTutorial } from 'lib/learn-client/types'
import { getBadges } from './get-badges'
import { formatProductsUsed } from './'

export interface InlineTutorials {
  [slug: string]: any //@TODO type this!
}

export interface InlineCollections {
  [slug: string]: any //@TODO type this!
}

export async function getInlineTutorials(
  tutorialSlugs: string[]
): Promise<InlineTutorials> {
  const tutorials = (await getTutorials(
    tutorialSlugs,
    false
  )) as ClientTutorial[]

  const augmentedTutorials = tutorials.reduce((acc, tutorial) => {
    const badges = getBadges(tutorial.productsUsed, tutorial.edition)
    const productsUsed = tutorial.productsUsed
      ? formatProductsUsed(tutorial.productsUsed)
      : undefined

    return Object.assign(acc, {
      [tutorial.slug]: {
        ...tutorial,
        productsUsed,
        badges,
        defaultContext: tutorial.collectionCtx.default.slug,
        videoId: tutorial.video?.id || undefined,
        handsOnLabId: tutorial.handsOnLab?.id || undefined,
        handsOnLabProvider: tutorial.handsOnLab?.provider || undefined,
      },
    })
  }, {})

  return augmentedTutorials
}

export async function getInlineCollections(
  collectionSlugs: string[]
): Promise<InlineCollections> {
  const collections = await getCollections(collectionSlugs)
  const formattedCollections = collections.reduce((acc, collection) => {
    return Object.assign(acc, {
      [collection.slug]: {
        ...collection,
        tutorials: collection.tutorials.map((t) => {
          if (!t.productsUsed) {
            return t
          }

          return {
            ...t,
            productsUsed: formatProductsUsed(t.productsUsed),
          }
        }),
      },
    })
  }, {})

  return formattedCollections
}

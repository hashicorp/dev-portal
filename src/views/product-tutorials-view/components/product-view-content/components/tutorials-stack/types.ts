import { Collection, ProductOption } from 'lib/learn-client/types'

/**
 * TODO
 * Many of these types were dropped in from the existing front-end repo.
 * Need to update to use the analogous types from lib/learn-client/types.
 * Intent is to make those updates during implementation of TutorialsStack
 */

interface BaseTutorial {
  id?: string
  slug: string
  name: string
  description: string
  readTime: number
}

type CollectionReference = Pick<
  Collection,
  'id' | 'name' | 'shortName' | 'slug' | 'theme' | 'level' | 'ordered'
>

type DefaultCollection = Omit<CollectionReference, 'level' | 'ordered'>

enum VideoHostOption {
  youtube = 'youtube',
  wistia = 'wistia',
}

// @TODO delete katacoda option once all removed
enum HandsOnLabProviderOption {
  katacoda = 'katacoda',
  instruqt = 'instruqt',
}

interface TutorialLabOptions {
  handsOnLabId?: string
  handsOnLabProvider?: HandsOnLabProviderOption
}

interface TutorialVideoOptions {
  videoId?: string
  videoHost?: VideoHostOption
  videoInline: number // @TODO update to a boolean
}

export interface ProductUsedRow {
  product: ProductOption
  tutorial: string
  isBeta: number
  isPrimary: number
  minVersion?: string
  maxVersion?: string
}

//
//
//

export interface TutorialStackItem
  extends BaseTutorial,
    TutorialLabOptions,
    Pick<TutorialVideoOptions, 'videoId'> {
  defaultContext?: DefaultCollection
  productsUsed?: ProductUsedRow[]
}

export interface TutorialsStackProps {
  /** Heading to show above the tutorial cards. */
  heading: string
  /**
   * Identifier for the heading, which should unique in the context of the page
   * Note: headingSlug is added after fetching content from the Learn API
   */
  headingSlug: string
  /** Subheading to show above the tutorial cards. */
  subheading?: string
  featuredTutorials: $TSFixMe[] // TutorialStackItem
}

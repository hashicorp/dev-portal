import {
  Collection,
  ProductUsed,
  Tutorial,
  TutorialVideo,
  TutorialHandsOnLab,
} from 'lib/learn-client/types'

export interface TutorialStackItem
  extends Pick<Tutorial, 'id' | 'slug' | 'name' | 'description' | 'readTime'> {
  handsOnLabId?: TutorialHandsOnLab['id']
  handsOnLabProvider?: TutorialHandsOnLab['provider']
  videoId?: TutorialVideo['id']
  defaultContext?: Pick<
    Collection,
    'id' | 'name' | 'shortName' | 'slug' | 'theme'
  >
  productsUsed?: ProductUsed[]
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
  featuredTutorials: TutorialStackItem[]
}

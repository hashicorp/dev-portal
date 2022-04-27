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
  /** Subheading to show above the tutorial cards. */
  subheading?: string
  featuredTutorials: TutorialStackItem[]
}

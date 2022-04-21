import { ProductSlug } from 'types/products'

export interface TutorialCardProps {
  /**
   * A short description of the tutorial.
   */
  description: string

  /**
   * A string representation the duration of the tutorial, such as "10mins".
   */
  duration: string

  /**
   * Whether the tutorial has an embedded interactive lab.
   */
  hasInteractiveLab: boolean

  /**
   * Whether the tutorial has a video associated with it.
   */
  hasVideo: boolean

  /**
   * The title of the tutorial.
   */
  heading: string

  /**
   * A URL that links to the tutorial.
   */
  url: string

  /**
   * A list of product slugs, representing products used in the tutorial.
   */
  productsUsed: ProductSlug[]
}

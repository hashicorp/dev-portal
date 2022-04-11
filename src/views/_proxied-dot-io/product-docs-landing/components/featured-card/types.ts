export interface FeaturedCardProps {
  /** Title text to show at the top of the card. */
  heading: string
  /** Descriptive text to show below the card heading.  */
  body: string
  /** Links to display in the card. The first link in this array will be styles as a "primary" link, the remaining links will be styled as "secondary" links. */
  links: {
    title: string
    url: string
  }[]
  /** Optional image to show in the card */
  image?: {
    src: string
    alt: string
  }
}

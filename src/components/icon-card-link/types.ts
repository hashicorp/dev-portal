import { ReactElement } from 'react'
import { ProductSlug } from 'types/products'

export interface IconCardLinkProps {
  /**
   * An icon from `@hashicorp/flight-icons` to render.
   *
   * Example:
   *
   * ```jsx
   * import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
   *
   * const MyComponent = () => {
   *  return (
   *    <IconCardLink
   *      icon={<IconLearn16 />}
   *      productSlug="waypoint"
   *      text="Tutorials"
   *      url="/waypoint/tutorials"
   *    />
   *  )
   * }
   * ```
   */
  icon: ReactElement

  /**
   * The slug of the product the IconCardLink should be branded to. Currently
   * used to determine the color of the icon rendered.
   */
  productSlug?: ProductSlug

  /**
   * The text to display to the right of the icon.
   */
  text: string

  /**
   * The destination the user should be taken to when the IconCardLink is
   * clicked. Passed directly to the inner rendered CardLink.
   */
  url: string
}

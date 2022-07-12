import classNames from 'classnames'
import { ProductOption } from 'lib/learn-client/types'
import ProductIcon from 'components/product-icon'
import { BadgeOptions } from '../..'
import s from './badge.module.css'

/**
 * Badge wrapper provides basic badge styles and markup
 */
interface BadgeWrapperProps {
  children: React.ReactNode
  className?: string
}

function BadgeWrapper({ children, className }: BadgeWrapperProps) {
  return <li className={classNames(s.badgeItem, className)}>{children}</li>
}

/**
 * `getBadgeComponent` takes a map of display options
 * and returns a default badge component that renders a label
 * and optional icon depending on the option type
 *
 * This component also accepts children so it can render a composition that doesn't
 * abide directly by the default badge display options
 *
 * _Note_: eventually these badges may also serve as links to filtered
 * library views
 */

export interface BadgeComponentProps {
  type: keyof BadgeOptions
  className?: string
}

export function getBadgeComponent(displayOptions) {
  function DefaultBadgeComponent({
    type,
    className,
  }: BadgeComponentProps): React.ReactElement {
    const badge = displayOptions[type]
    if (!badge) {
      return null
    }

    return (
      <BadgeWrapper className={className}>
        {badge.icon ? <badge.icon className={s.icon} /> : null}
        {badge.label}
      </BadgeWrapper>
    )
  }

  return DefaultBadgeComponent
}

// Product badges need a custom badge variant with the `ProductIcon` component
export type ProductDisplayOption = { label: string; slug: ProductOption }

export function renderProductBadges(
  productDisplayOptions: ProductDisplayOption[]
) {
  return productDisplayOptions.map((p: ProductDisplayOption) => (
    <BadgeWrapper key={p.slug}>
      <ProductIcon productSlug={p.slug} className={s.icon} />
      {p.label}
    </BadgeWrapper>
  ))
}

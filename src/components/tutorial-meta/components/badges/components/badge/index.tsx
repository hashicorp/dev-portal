import { Fragment } from 'react'
import classNames from 'classnames'
import { ProductOption } from 'lib/learn-client/types'
import ProductIcon from 'components/product-icon'
import { BadgesProps } from '../..'
import s from './badge.module.css'

export interface BadgeComponentProps {
  type?: keyof BadgesProps
  className?: string
  children?: React.ReactNode
}

/**
 * The badge component depends on a map of display options
 * and renders a label and optional icon depending on the option type
 *
 * This component also accepts children so it can render a composition that doesn't
 * abide directly by the display options
 */

export function getBadgeComponent(displayOptions) {
  function DefaultBadgeComponent({
    type,
    children,
    className,
  }: BadgeComponentProps): React.ReactElement {
    if (children) {
      return <li className={classNames(s.badgeItem, className)}>{children}</li>
    }

    const badge = displayOptions[type]
    if (!badge) {
      return null
    }

    return (
      <li className={classNames(s.badgeItem, className)}>
        {badge.icon ? <badge.icon className={s.icon} /> : null}
        {badge.label}
      </li>
    )
  }

  return DefaultBadgeComponent
}

export type ProductDisplayOption = { label: string; slug: ProductOption }

export function ProductBadge({ product }: { product: ProductDisplayOption }) {
  return (
    <li className={s.badgeItem}>
      <ProductIcon product={product.slug} className={s.icon} />
      {product.label}
    </li>
  )
}

export function renderProductBadges(
  productDisplayOptions: ProductDisplayOption[]
) {
  return productDisplayOptions.map((p) => (
    <ProductBadge key={p.label} product={p} />
  ))
}

import { ForwardRefExoticComponent, RefAttributes } from 'react'
import classNames from 'classnames'
import { IconProps } from '@hashicorp/flight-icons/svg-react/types'
import { IconClock16 } from '@hashicorp/flight-icons/svg-react/clock-16'
import { IconPlay16 } from '@hashicorp/flight-icons/svg-react/play-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { EditionOption, Product as ClientProduct } from 'lib/learn-client/types'
import s from './badges.module.css'
import ProductIcon from 'components/product-icon'

export interface BadgesProps {
  readTime: number
  products: Pick<ClientProduct, 'name' | 'slug'>[]
  isBeta: boolean
  edition: EditionOption
  hasVideo: boolean
  isInteractive: boolean
}
//TODO add return type
function generateBadges(readTime, products, edition) {
  return {
    readTime: {
      label: `${readTime} min`,
      icon: IconClock16,
    },
    isBeta: { label: 'Beta' },
    edition: { label: editionDisplayOptions[edition] },
    products: products.map((p) => ({
      label: p.name,
      icon: () => <ProductIcon product={p.slug} />,
    })),
    hasVideo: { label: 'Video', icon: IconPlay16 },
    isInteractive: { label: 'Interactive', icon: IconTerminalScreen16 },
  }
}

const editionDisplayOptions = {
  [EditionOption.tfcFree]: { label: 'Terraform Cloud' },
  [EditionOption.tfcTeam]: { label: 'Team' },
  [EditionOption.tfcGov]: {
    label: 'Team & Governance',
  },
  [EditionOption.enterprise]: {
    label: 'Enterprise',
  },
  [EditionOption.tfcBiz]: { label: 'Business' },
  [EditionOption.hcp]: {
    label: 'HCP',
  },
}

interface BadgeProps {
  type: keyof BadgesProps
  className?: string
  children?: React.ReactNode
}

// @TODO cleanup conditional rendering, look for improved abstraction

export function Badges(props: BadgesProps): React.ReactElement {
  const { readTime, products, edition, isBeta, hasVideo, isInteractive } = props
  const badgeDisplayOptions = generateBadges(readTime, products, edition)

  // could use object.keys here in the displayoptions thing to render the badge component
  // need to handle the products
  function Badge({ type, className }: BadgeProps) {
    const badge = badgeDisplayOptions[type]
    const Icon = badge.icon ? badge.icon : null
    return (
      <li className={classNames(s.badgeItem, className)}>
        <Icon className={s.icon} />
        {badge.label}
      </li>
    )
  }
  return (
    <ul className={s.list}>
      <Badge type="readTime" />
      {isBeta ? <Badge className={s.beta} type="isBeta" /> : null}
      {edition !== 'open_source' ? <Badge type="edition" /> : null}
      {/* {products.length > 0
        ? products.map((p) => (
            <Badge key={p.slug}>
              <ProductIcon product={p.slug} className={s.icon} />
              {p.name}
            </Badge>
          ))
        : null} */}
      {hasVideo ? <Badge type="hasVideo" /> : null}
      {isInteractive ? <Badge type="isInteractive" /> : null}
    </ul>
  )
}

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

const badgeDisplayOptions: {
  [BadgeOption: string]: {
    label: string
    icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
  }
} = {
  readTime: { label: ' min', icon: IconClock16 },
  hasVideo: { label: 'Video', icon: IconPlay16 },
  isInteractive: { label: 'Interactive', icon: IconTerminalScreen16 },
  isBeta: { label: 'Beta' },
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
  type?: keyof BadgesProps
  label?: string
  className?: string
  children?: React.ReactNode
}

// @TODO eventually this will be a link when we have the advanced search page
function Badge({ type, label, children, className }: BadgeProps) {
  const badge = badgeDisplayOptions[type]
  const Icon = badge?.icon
  const Label = label || badge?.label
  const Inner =
    type && badge ? (
      <>
        {badge.icon ? <Icon className={s.icon} /> : null}
        {Label}
      </>
    ) : (
      children
    )
  return <li className={classNames(s.badgeItem, className)}>{Inner}</li>
}

// @TODO cleanup conditional rendering, look for improved abstraction

export function Badges({
  readTime,
  products,
  edition,
  isBeta,
  hasVideo,
  isInteractive,
}: BadgesProps): React.ReactElement {
  return (
    <ul className={s.list}>
      <Badge type="readTime" label={`${readTime} min`} />
      {isBeta ? <Badge className={s.beta} type="isBeta" /> : null}
      {edition !== 'open_source' ? (
        <Badge>{editionDisplayOptions[edition].label}</Badge>
      ) : null}
      {products.length > 0
        ? products.map((p) => (
            <Badge key={p.slug}>
              <ProductIcon product={p.slug} className={s.icon} />
              {p.name}
            </Badge>
          ))
        : null}
      {hasVideo ? <Badge type="hasVideo" /> : null}
      {isInteractive ? <Badge type="isInteractive" /> : null}
    </ul>
  )
}

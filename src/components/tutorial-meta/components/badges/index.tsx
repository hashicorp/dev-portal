import classNames from 'classnames'
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
      <Badge>
        <IconClock16 className={s.icon} />
        <span>{readTime} min</span>
      </Badge>
      {isBeta ? (
        <Badge className={s.beta}>{editionDisplayOptions['beta'].label}</Badge>
      ) : null}
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
      {hasVideo ? (
        <Badge>
          <IconPlay16 className={s.icon} />
          <span>Video</span>
        </Badge>
      ) : null}
      {isInteractive ? (
        <Badge>
          <IconTerminalScreen16 className={s.icon} />
          <span>Interactive</span>
        </Badge>
      ) : null}
    </ul>
  )
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <li className={classNames(s.badgeItem, className)}>{children}</li>
}

const editionDisplayOptions: {
  [BadgeOption: string]: {
    label: string
  }
} = {
  [EditionOption.tfcFree]: { label: 'Terraform Cloud' },
  [EditionOption.tfcTeam]: { label: 'Team' },
  [EditionOption.tfcGov]: {
    label: 'Team & Governance',
  },
  [EditionOption.enterprise]: {
    label: 'Enterprise',
  },
  [EditionOption.tfcBiz]: { label: 'Business' },
  beta: { label: 'Beta' },
  [EditionOption.hcp]: {
    label: 'HCP',
  },
  open_source: { label: 'Open Source' },
}

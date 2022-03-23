import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  ReactElement,
  JSXElementConstructor,
} from 'react'
import { IconProps } from '@hashicorp/flight-icons/svg-react/types'
import { IconClock16 } from '@hashicorp/flight-icons/svg-react/clock-16'
import { IconPlay16 } from '@hashicorp/flight-icons/svg-react/play-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { EditionOption } from 'lib/learn-client/types'
import { ProductUsed as ClientProductUsed } from 'lib/learn-client/types'
import {
  getBadgeComponent,
  ProductDisplayOption,
  BadgeComponentProps,
} from './components/badge'
import { BadgesProps } from '.'

export function getIsBeta(productsUsed: ClientProductUsed[]): boolean {
  let isBeta = false

  for (let i; i < productsUsed.length; i++) {
    if (productsUsed[i].isBeta) {
      isBeta = true
      break
    }
  }

  return isBeta
}

type BadgeOptions = keyof BadgesProps

type DisplayOptions = {
  [K in BadgeOptions]: DisplayOption | ProductDisplayOption[]
}

type DisplayOption = {
  label: string
  icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
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

// Returns a map of badge display options and a Badge component to render
export function generateBadges(
  readTime,
  products,
  edition
): [DisplayOptions, React.FC<BadgeComponentProps>] {
  const displayOptions = {
    readTime: {
      label: `${readTime} min`,
      icon: IconClock16,
    },
    isBeta: { label: 'Beta' },
    edition: { label: editionDisplayOptions[edition] },
    products: products.map((p) => ({
      label: p.name,
      slug: p.slug,
    })) as ProductDisplayOption[],
    hasVideo: { label: 'Video', icon: IconPlay16 },
    isInteractive: { label: 'Interactive', icon: IconTerminalScreen16 },
  }
  const Badge = getBadgeComponent(displayOptions)
  return [displayOptions, Badge]
}

import React, { ForwardRefExoticComponent, RefAttributes } from 'react'
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
import { BadgeOptions } from '.'

type DisplayOptions = {
  [K in keyof BadgeOptions]: DisplayOption | ProductDisplayOption[]
}

type DisplayOption = {
  label: string
  icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
}

const editionDisplayOptions: { [K in EditionOption]: string } = {
  [EditionOption.tfcFree]: 'Terraform Cloud',
  [EditionOption.tfcTeam]: 'Team',
  [EditionOption.tfcGov]: 'Team & Governance',
  [EditionOption.enterprise]: 'Enterprise',
  [EditionOption.tfcBiz]: 'Business',
  [EditionOption.hcp]: 'HCP',
  [EditionOption.openSource]: 'Open Source',
}

// Returns a map of badge display options and a Default Badge component to render
export function generateBadges(
  readTime: number,
  products: $TSFixMe,
  edition: $TSFixMe
): [DisplayOptions, React.FC<BadgeComponentProps>] {
  const displayOptions = {
    readTime: {
      label: getReadableTime(readTime),
      icon: IconClock16,
    },
    isBeta: { label: 'Beta' },
    edition: {
      label: editionDisplayOptions[edition as EditionOption],
    },
    products: products.map((p: $TSFixMe) => ({
      label: p.name,
      slug: p.slug,
    })) as ProductDisplayOption[], // There can be many products associated with a single tutorial
    hasVideo: { label: 'Video', icon: IconPlay16 },
    isInteractive: { label: 'Interactive', icon: IconTerminalScreen16 },
  }
  const DefaultBadgeComponent = getBadgeComponent(displayOptions)

  return [displayOptions, DefaultBadgeComponent]
}

// calculates whether a tutorial is 'beta' based on productsUsed data
export function getIsBeta(productsUsed: ClientProductUsed[]): boolean {
  let isBeta = false

  for (let i = 0; i < productsUsed.length; i++) {
    if (productsUsed[i].isBeta) {
      isBeta = true
      break
    }
  }

  return isBeta
}

// This utility function creates a readable string for presentation only
// based on the number of minutes provided
// For example: 831 => 13 HR 51 MIN
export default function getReadableTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const min = minutes % 60
  if (hours && min > 0) {
    return `${hours}hr ${min}min`
  }
  if (hours) {
    return `${hours}hr`
  }
  return `${minutes}min`
}

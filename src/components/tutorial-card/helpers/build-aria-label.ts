import { ProductOption } from 'lib/learn-client/types'
import { TutorialCardProps } from '../types'

const PRODUCT_LABEL_MAP: Record<ProductOption, string> = {
  boundary: 'Boundary',
  consul: 'Consul',
  nomad: 'Nomad',
  packer: 'Packer',
  terraform: 'Terraform',
  vault: 'Vault',
  vagrant: 'Vagrant',
  waypoint: 'Waypoint',
}

export function buildAriaLabel({
  heading,
  duration,
  productsUsed,
  hasVideo,
  hasInteractiveLab,
}: Pick<
  TutorialCardProps,
  'heading' | 'duration' | 'productsUsed' | 'hasVideo' | 'hasInteractiveLab'
>): string {
  let ariaLabel = ''
  const speakableDuration = duration
    .replace('hr', ' hour')
    .replace('min', ' minute')
  ariaLabel += `${heading}. ${speakableDuration} tutorial.`
  if (productsUsed.length > 0) {
    ariaLabel += ` Uses the following products: ${productsUsed
      .map((p: ProductOption) => PRODUCT_LABEL_MAP[p])
      .join(', ')}.`
  }
  if (hasInteractiveLab) {
    ariaLabel += ` Tutorial has interactive lab.`
  }
  if (hasVideo) {
    ariaLabel += ` Tutorial has video.`
  }
  return ariaLabel
}

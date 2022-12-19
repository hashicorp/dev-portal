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

export function getSpeakableDuration(duration: TutorialCardProps['duration']) {
	const speakableDuration = duration
		.replace('hr', ' hour')
		.replace('min', ' minute')
	return `${speakableDuration} tutorial.`
}

export function buildAriaLabel({
	heading,
	productsUsed,
	hasVideo,
	hasInteractiveLab,
	eyebrowSlotAriaLabel,
}: Pick<
	TutorialCardProps,
	'heading' | 'duration' | 'productsUsed' | 'hasVideo' | 'hasInteractiveLab'
> & { eyebrowSlotAriaLabel?: string }): string {
	let ariaLabel = ''
	ariaLabel += `${heading}.`
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
	if (eyebrowSlotAriaLabel) {
		ariaLabel += ` ${eyebrowSlotAriaLabel}`
	}
	return ariaLabel
}

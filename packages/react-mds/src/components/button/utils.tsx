import type { ButtonColor, Theme, ThemeVariant } from './types'

export const COLORS = [
	'primary',
	'primary-black',
	'primary-white',
	'secondary', // deprecated; maps to secondary-white
	'secondary-high-contrast', // alternates between secondary-black and secondary-white based on theme
	'secondary-white',
	'secondary-black',
	'tertiary',
	'critical',
	'boundary',
	'consul',
	'nomad',
	'packer',
	'terraform',
	'vagrant',
	'vault',
	'waypoint',
	'hashicorp', // alias to primary
] as const

export function determineColor(theme?: Theme): ButtonColor {
	const variant: ThemeVariant = theme?.variant ? theme.variant : 'primary'

	if (variant === 'primary') {
		switch (theme?.brand) {
			case 'hashicorp':
				return 'primary'
			case 'boundary':
			case 'consul':
			case 'nomad':
			case 'packer':
			case 'terraform':
			case 'vagrant':
			case 'vault':
			case 'waypoint':
				return theme.brand
			case 'neutral':
				return 'secondary-high-contrast'
			default:
				return 'primary'
		}
	}

	if (variant === 'secondary') {
		return 'secondary'
	}

	if (
		variant === 'tertiary' ||
		variant === 'tertiary-neutral' ||
		variant === 'ghost'
	) {
		return 'tertiary'
	}

	throw new Error(
		`Unable to determine HDS Button color from theme: ${JSON.stringify(theme)}`
	)
}

export const LINK_TYPE_ICON_MAP = {
	inbound: 'inbound',
	outbound: 'external-link',
	download: 'download',
	anchor: 'anchor',
}

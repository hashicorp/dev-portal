import classNames from 'classnames'
import { FlightIcon, FlightIconSize } from '../flight-icon'
import type { HTMLAttributes } from 'react'
import s from './style.module.scss'

type BaseProps = {
	size: 'small' | 'medium' | 'large'
	iconSecondary?: string
	color?:
		| 'neutral'
		| 'boundary'
		| 'consul'
		| 'nomad'
		| 'packer'
		| 'terraform'
		| 'vagrant'
		| 'vault'
		| 'vault-secrets'
		| 'waypoint'
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>

type WithLogo = {
	logo:
		| 'hcp'
		| 'boundary'
		| 'consul'
		| 'nomad'
		| 'packer'
		| 'terraform'
		| 'vagrant'
		| 'vault'
		| 'vault-secrets'
		| 'waypoint'
	icon?: never
}

type WithIcon = {
	icon: string
	logo?: never
}

type IconTileProps = BaseProps & (WithLogo | WithIcon)

const EXTRA_ICON_SIZE_MAP = {
	small: 12,
	medium: 16,
	large: 16,
} as const satisfies Record<'small' | 'medium' | 'large', FlightIconSize>

const IconTile = ({
	size = 'medium',
	logo,
	icon,
	iconSecondary,
	color = 'neutral',
	...rest
}: IconTileProps) => {
	const iconName = logo ? `${logo}-color` : icon

	if (iconName) {
		const iconSize = size === 'small' ? 16 : 24
		const entity = logo ? 'logo' : 'icon'
		const colorUse = logo ? logo : color

		return (
			<div
				className={classNames(
					s['icon-tile'],
					s[`type-${entity}`],
					s[`size-${size}`],
					s[`color-${colorUse}`]
				)}
				aria-hidden="true"
				{...rest}
			>
				<div className={logo ? s.logo : s.icon}>
					<FlightIcon name={iconName} size={iconSize} stretched />
				</div>
				{iconSecondary && (
					<div className={s.extra}>
						<FlightIcon
							name={iconSecondary}
							size={EXTRA_ICON_SIZE_MAP[size]}
							color="var(--token-color-foreground-strong)"
						/>
					</div>
				)}
			</div>
		)
	}
}

export type { IconTileProps }
export { IconTile }

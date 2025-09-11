import svgSprite from '@hashicorp/flight-icons/svg-sprite/svg-sprite.svg'
import classNames from 'classnames'
import { useId, type SVGProps } from 'react'
import type { IconName } from '@hashicorp/flight-icons/svg'
import s from './flight-icon.module.css'

const FLIGHT_ICON_SIZES = [12, 16, 24, 32] as const
type FlightIconSize = (typeof FLIGHT_ICON_SIZES)[number]

const SPRITE_SIZE_MAP = {
	12: 16,
	16: 16,
	24: 24,
	32: 24,
} as const

type FlightIconName = IconName | (string & Record<never, never>)

interface FlightIconProps extends SVGProps<SVGSVGElement> {
	/**
	 * The name of the icon you wish to use. Search for existing icon
	 * names in the Icon library.
	 */
	name: FlightIconName

	/**
	 * The `color` prop can be used to change the color. It works by setting
	 * the value of the icon SVG’s fill property.
	 */
	color?: string

	/**
	 * The `size` prop can be used to change the size.
	 */
	size?: FlightIconSize

	/**
	 * Determines whether the icon will stretch to fill the parent container.
	 * Setting it to `true` will make the icon have a height and width of 100%
	 * and a display of `block`.
	 */
	stretched?: boolean

	/**
	 * Sets the `display` style for the icon. Setting it to `false` will make
	 * the icon have a display of `block`.
	 */
	isInlineBlock?: boolean

	/**
	 * Use to add accessible text to standalone icons. This will also change
	 * the `aria-hidden` value to `false` instead of the default value of `true`.
	 */
	title?: string
	className?: string
}

// When an SVG file is imported in Next.js, it is an object with a `src`
// property. However, tools like Webpack and Vite default to returning a URL.
// This runtime check allows the component to work in all of these cases.
const svgSpriteSrc =
	typeof svgSprite === 'string' ? svgSprite : (svgSprite as { src: string }).src

const FlightIcon = ({
	name,
	color = 'currentColor',
	size = 16,
	stretched = false,
	isInlineBlock = true,
	title,
	className,
	...rest
}: FlightIconProps) => {
	const iconId = useId()
	const titleId = useId()

	const spriteSize = SPRITE_SIZE_MAP[size]

	return (
		<svg
			className={classNames(
				s['flight-icon'],
				`flight-icon-${name}`,
				{
					[s['display-inline']]: isInlineBlock && !stretched,
					[s['loading']]: name === 'loading',
					[s['running']]: name === 'running',
				},
				className
			)}
			{...rest}
			aria-hidden={title ? 'false' : 'true'}
			aria-labelledby={title ? titleId : undefined}
			fill={color}
			id={iconId}
			role={title ? 'img' : undefined}
			width={stretched ? '100%' : size}
			height={stretched ? '100%' : size}
			viewBox={`0 0 ${spriteSize} ${spriteSize}`}
			xmlns="http://www.w3.org/2000/svg"
		>
			{title ? (
				<>
					<title id={titleId}>{title}</title>
					<g role="presentation">
						<use href={`${svgSpriteSrc}#flight-${name}-${spriteSize}`}></use>
					</g>
				</>
			) : (
				<use href={`${svgSpriteSrc}#flight-${name}-${spriteSize}`}></use>
			)}
		</svg>
	)
}

export type { FlightIconProps, FlightIconSize, FlightIconName }
export { FlightIcon, FLIGHT_ICON_SIZES }

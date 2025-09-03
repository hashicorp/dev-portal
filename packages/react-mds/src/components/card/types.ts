import type { BadgeProps } from '../badge'
import type { ImageProps } from 'next/image'
import type { ReactNode } from 'react'
import { StandaloneLinkProps } from '../standalone-link'

interface CardPropsBase {
	className?: string
	ctaLabel?: string
	href?: string
	standaloneLink?: StandaloneLinkProps
	onClickCapture?: React.MouseEventHandler<HTMLAnchorElement>
	isExternal?: boolean
	'aria-label'?: string
}

export type CardProps =
	| (CardPropsBase & { content: CardContentProps; children?: never })
	| (CardPropsBase & { content?: never; children: React.ReactNode })

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type NonZeroDigit = Exclude<Digit, '0'>

type CardThumbnailAspectRatio =
	| `${NonZeroDigit}/${NonZeroDigit}` // 1/1 to 9/9
	| `${NonZeroDigit}/${NonZeroDigit}${Digit}` // 1/10 to 9/99
	| `${NonZeroDigit}${Digit}/${NonZeroDigit}` // 10/1 to 99/9
	| `${NonZeroDigit}${Digit}/${NonZeroDigit}${Digit}` // 10/10 to 99/99

export interface CardThumbnailProps extends Pick<ImageProps, 'alt' | 'src'> {
	/**
	 * The aspect ratio of the image, specified as a string in the format `width/height`.
	 * This follows the same format as the CSS `aspect-ratio` property.
	 *
	 * @example "16/9" - This would represent an aspect ratio of 16:9.
	 * @example "4/3" - This would represent an aspect ratio of 4:3.
	 */
	aspectRatio: CardThumbnailAspectRatio
}

export interface CardContentProps {
	badges?: BadgeProps[]
	cta?: CardCtaProps
	eyebrow?: ReactNode
	heading?: string
	subheading?: string
	description?: React.ReactNode
	thumbnail?: CardThumbnailProps
	showArrow?: boolean
}

export interface CardCtaProps {
	href?: string
	ctaLabel?: string
	standaloneLink?: StandaloneLinkProps
	onClickCapture?: React.MouseEventHandler<HTMLAnchorElement>
	isExternal?: boolean
}

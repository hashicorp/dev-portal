import { PropsWithChildren } from 'react'
import { makeNormalizer, makeNormalizerSet } from '../../utils/make-normalizer'
import classNames from 'classnames'
import s from './layout.module.css'

const DEFAULT_APPEARANCE = 'light'
const DEFAULT_BACKGROUND = 'primary'
const DEFAULT_PADDING_TOP = 'medium'
const DEFAULT_PADDING_BOTTOM = 'medium'

export const LAYOUT_APPEARANCES = ['light', 'dark'] as const
export const LAYOUT_BACKGROUNDS = ['primary', 'faint', 'transparent'] as const
export const LAYOUT_PADDING = ['none', 'small', 'medium', 'large'] as const

export type LayoutAppearance = (typeof LAYOUT_APPEARANCES)[number]
export type LayoutBackground = (typeof LAYOUT_BACKGROUNDS)[number]
export type LayoutPadding = (typeof LAYOUT_PADDING)[number]

export const normalizeLayoutProps = makeNormalizerSet({
	appearance: makeNormalizer(LAYOUT_APPEARANCES, {
		fallback: DEFAULT_APPEARANCE,
	}),
	background: makeNormalizer(LAYOUT_BACKGROUNDS, {
		fallback: DEFAULT_BACKGROUND,
	}),
	paddingTop: makeNormalizer(LAYOUT_PADDING, {
		fallback: DEFAULT_PADDING_TOP,
	}),
	paddingBottom: makeNormalizer(LAYOUT_PADDING, {
		fallback: DEFAULT_PADDING_BOTTOM,
	}),
})

export interface LayoutProps extends PropsWithChildren {
	className?: string
	/**
	 * The appearance of the layout
	 */
	appearance?: LayoutAppearance
	/**
	 * The color token used for the background. The color value changes based on `appearance`
	 */
	background?: LayoutBackground
	/**
	 * The space between the layout component's content and its top border
	 */
	paddingTop?: LayoutPadding
	/**
	 * The space between the layout component's content and its bottom border
	 */
	paddingBottom?: LayoutPadding
}

export const Layout = ({
	className,
	children,
	appearance = DEFAULT_APPEARANCE,
	background = DEFAULT_BACKGROUND,
	paddingBottom = DEFAULT_PADDING_TOP,
	paddingTop = DEFAULT_PADDING_BOTTOM,
}: LayoutProps) => {
	return (
		<div
			className={classNames([
				s.layout,
				{ ['mds-dark-mode']: appearance === 'dark' },
				s[background],
				s[`padding-top-${paddingTop}`],
				s[`padding-bottom-${paddingBottom}`],
				className,
			])}
		>
			{children}
		</div>
	)
}
